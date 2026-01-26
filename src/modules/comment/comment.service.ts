/**
 * @file Comment service
 * @module module/comment/service
 * @author Surmon <https://github.com/surmon-china>
 */

import type { QueryFilter, MongooseBaseQueryOptions } from 'mongoose'
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ForbiddenException, BadRequestException, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@app/transformers/model.transformer'
import { MongooseModel, MongooseDoc, MongooseId } from '@app/interfaces/mongoose.interface'
import { PaginateResult, PaginateOptions } from '@app/utils/paginate'
import { GUESTBOOK_POST_ID } from '@app/constants/biz.constant'
import { ArticleService } from '@app/modules/article/article.service'
import { IPService } from '@app/core/helper/helper.service.ip'
import { EmailService } from '@app/core/helper/helper.service.email'
import { AkismetService, AkismetAction } from '@app/core/helper/helper.service.akismet'
import { QueryVisitor } from '@app/decorators/request-context.decorator'
import { OptionsService } from '@app/modules/options/options.service'
import { getPermalinkById } from '@app/transformers/urlmap.transformer'
import { CommentStatus, COMMENT_GUEST_QUERY_FILTER } from './comment.constant'
import { Comment, CommentBase } from './comment.model'
import { CommentsStatusDTO } from './comment.dto'
import { isDevEnv, isProdEnv } from '@app/app.environment'
import { createLogger } from '@app/utils/logger'
import * as APP_CONFIG from '@app/app.config'

const logger = createLogger({ scope: 'CommentService', time: isDevEnv })

@Injectable()
export class CommentService {
  constructor(
    private readonly ipService: IPService,
    private readonly emailService: EmailService,
    private readonly akismetService: AkismetService,
    private readonly optionsService: OptionsService,
    private readonly articleService: ArticleService,
    @InjectModel(Comment) private readonly commentModel: MongooseModel<Comment>
  ) {}

  private async emailToAdminAndTargetAuthor(comment: Comment) {
    const onWhere =
      comment.post_id === GUESTBOOK_POST_ID
        ? 'guestbook'
        : await this.articleService
            .getDetailByNumberIdOrSlug({ numberId: comment.post_id, lean: true })
            .then((article) => `"${article.title}"`)

    const authorName = comment.author.name
    const getMailContent = (subject = '') => {
      const texts = [`${subject} on ${onWhere}.`, `${authorName}: ${comment.content}`]
      const textHTML = texts.map((text) => `<p>${text}</p>`).join('')
      const replyText = `Reply to ${authorName} #${comment.id}`
      const commentLink = getPermalinkById(comment.post_id) + `#comment-${comment.id}`
      const linkHTML = `<a href="${commentLink}" target="_blank">${replyText}</a>`
      return {
        text: texts.join('\n'),
        html: [textHTML, `<br>`, linkHTML].join('\n')
      }
    }

    // Email to admin
    const subject = `You have a new comment`
    this.emailService.sendMailAs(APP_CONFIG.APP_BIZ.FE_NAME, {
      to: APP_CONFIG.APP_BIZ.ADMIN_EMAIL,
      subject,
      ...getMailContent(subject)
    })

    // Email to parent comment author
    if (comment.pid) {
      this.commentModel.findOne({ id: comment.pid }).then((parentComment) => {
        if (parentComment?.author.email) {
          const subject = `Your comment #${parentComment.id} has a new reply`
          this.emailService.sendMailAs(APP_CONFIG.APP_BIZ.FE_NAME, {
            to: parentComment.author.email,
            subject,
            ...getMailContent(subject)
          })
        }
      })
    }
  }

  private submitCommentAkismet(action: AkismetAction, comment: Comment, referer?: string): Promise<void> {
    return this.akismetService[action]({
      user_ip: comment.ip!,
      user_agent: comment.agent!,
      referrer: referer || '',
      permalink: getPermalinkById(comment.post_id),
      comment_type: comment.pid ? 'reply' : 'comment',
      comment_author: comment.author.name,
      comment_author_email: comment.author.email,
      comment_author_url: comment.author.site,
      comment_content: comment.content
    })
  }

  private async updateCommentsCountWithArticles(postIds: number[]) {
    // Filter invalid post_id & guestbook
    postIds = postIds.map(Number).filter(Boolean)
    if (!postIds.length) {
      return false
    }

    try {
      const counts = await this.commentModel.aggregate<{ _id: number; num_tutorial: number }>([
        { $match: { ...COMMENT_GUEST_QUERY_FILTER, post_id: { $in: postIds } } },
        { $group: { _id: '$post_id', num_tutorial: { $sum: 1 } } }
      ])
      if (!counts || !counts.length) {
        await this.articleService.updateStatsComments(postIds[0], 0)
      } else {
        await Promise.all(
          counts.map((count) => {
            return this.articleService.updateStatsComments(count._id, count.num_tutorial)
          })
        )
      }
    } catch (error) {
      logger.warn('updateCommentCountWithArticle failed!', error)
    }
  }

  // Comment status effects
  private updateBlocklistAkismetWithComment(comments: Comment[], status: CommentStatus, referer?: string) {
    const isSPAM = status === CommentStatus.Spam
    const action = isSPAM ? AkismetAction.SubmitSpam : AkismetAction.SubmitHam
    // SPAM > append to blocklist & submitSpam
    // HAM > remove from blocklist & submitHAM
    // Akismet
    comments.forEach((comment) => this.submitCommentAkismet(action, comment, referer))
    // block list
    const ips: string[] = comments.map((comment) => comment.ip!).filter(Boolean)
    const emails: string[] = comments.map((comment) => comment.author.email!).filter(Boolean)
    const blocklistAction = isSPAM
      ? this.optionsService.appendToBlocklist({ ips, emails })
      : this.optionsService.removeFromBlocklist({ ips, emails })
    blocklistAction
      .then(() => logger.info('updateBlocklistAkismetWithComment.blocklistAction succeeded.'))
      .catch((error) => logger.warn('updateBlocklistAkismetWithComment.blocklistAction failed!', error))
  }

  // Validate comment by NodePress IP/email/keywords
  public async verifyCommentValidity(comment: Comment): Promise<void> {
    const { blocklist } = await this.optionsService.ensureAppOptions()
    const { keywords, mails, ips } = blocklist
    const blockByIP = ips.includes(comment.ip!)
    const blockByEmail = mails.includes(comment.author.email!)
    const blockByKeyword = keywords.length && new RegExp(`${keywords.join('|')}`, 'ig').test(comment.content)
    if (blockByIP || blockByEmail || blockByKeyword) {
      const reason = blockByIP ? 'Blocked IP' : blockByEmail ? 'Blocked Email' : 'Blocked Keywords'
      throw new ForbiddenException(`Comment blocked. Reason: ${reason}`)
    }
  }

  // Validate comment target commentable
  public async verifyTargetCommentable(targetPostId: number): Promise<void> {
    if (targetPostId !== GUESTBOOK_POST_ID) {
      if (!(await this.articleService.isCommentableArticle(targetPostId))) {
        throw new BadRequestException(`Comment is not allowed on post ID: ${targetPostId}`)
      }
    }
  }

  public getAll(): Promise<Array<Comment>> {
    return this.commentModel.find().lean().exec()
  }

  // Get comment list
  public paginate(
    filter: QueryFilter<Comment>,
    options: PaginateOptions
  ): Promise<PaginateResult<MongooseDoc<Comment>>> {
    // MARK: can't use 'lean' with virtual 'email_hash'
    // MARK: can't use select('-email') with virtual 'email_hash'
    // MARK: keep 'paginate', the 'paginateRaw' method is not available here.
    // https://github.com/Automattic/mongoose/issues/3130#issuecomment-395750197
    return this.commentModel.paginate(filter, options)
  }

  public normalizeNewComment(comment: CommentBase, visitor: QueryVisitor): Comment {
    return {
      ...comment,
      pid: Number(comment.pid),
      post_id: Number(comment.post_id),
      status: CommentStatus.Published,
      likes: 0,
      dislikes: 0,
      ip: visitor.ip,
      ip_location: {},
      agent: visitor.ua || comment.agent,
      extras: []
    }
  }

  // Create comment
  public async create(comment: Comment): Promise<MongooseDoc<Comment>> {
    const ip_location = isProdEnv && comment.ip ? await this.ipService.queryLocation(comment.ip) : null
    const succeededComment = await this.commentModel.create({
      ...comment,
      ip_location
    })
    // update aggregate & email notification
    this.updateCommentsCountWithArticles([succeededComment.post_id])
    this.emailToAdminAndTargetAuthor(succeededComment)
    return succeededComment
  }

  // Create comment from client
  public async createFormClient(comment: CommentBase, visitor: QueryVisitor): Promise<MongooseDoc<Comment>> {
    if (!comment.author.email) {
      throw new BadRequestException('Author email should not be empty')
    }
    // 1. Standardize comment data to ensure that some fields cannot be overwritten by users
    const newComment = this.normalizeNewComment(comment, visitor)
    // 2. check commentable
    await this.verifyTargetCommentable(newComment.post_id)
    // 3. block list | akismet
    await Promise.all([
      this.verifyCommentValidity(newComment),
      this.submitCommentAkismet(AkismetAction.CheckSpam, newComment, visitor.referer)
    ])
    // 4. create data in DB
    return this.create(newComment)
  }

  // Get comment detail by ObjectId
  public async getDetailByObjectId(commentId: MongooseId): Promise<MongooseDoc<Comment>> {
    const comment = await this.commentModel.findById(commentId).exec()
    if (!comment) throw new NotFoundException(`Comment '${commentId}' not found`)
    return comment
  }

  // Get comment detail by number ID
  public async getDetailByNumberId(commentId: number): Promise<MongooseDoc<Comment>> {
    const comment = await this.commentModel.findOne({ id: commentId }).exec()
    if (!comment) throw new NotFoundException(`Comment '${commentId}' not found`)
    return comment
  }

  // Update comment
  public async update(
    commentId: MongooseId,
    newComment: Partial<Comment>,
    referer?: string
  ): Promise<MongooseDoc<Comment>> {
    const updated = await this.commentModel.findByIdAndUpdate(commentId, newComment, { new: true }).exec()
    if (!updated) throw new NotFoundException(`Comment '${commentId}' not found`)

    this.updateCommentsCountWithArticles([updated.post_id])
    this.updateBlocklistAkismetWithComment([updated], updated.status, referer)
    return updated
  }

  // Delete comment
  public async delete(commentId: MongooseId) {
    const deleted = await this.commentModel.findByIdAndDelete(commentId, null).exec()
    if (!deleted) throw new NotFoundException(`Comment '${commentId}' not found`)

    this.updateCommentsCountWithArticles([deleted.post_id])
    return deleted
  }

  public async batchPatchStatus(action: CommentsStatusDTO, referer?: string) {
    const { comment_ids, post_ids, status } = action
    const actionResult = await this.commentModel
      .updateMany({ _id: { $in: comment_ids } }, { $set: { status } })
      .exec()
    // update ref article.stats.comments
    this.updateCommentsCountWithArticles(post_ids)
    try {
      const todoComments = await this.commentModel.find({ _id: { $in: comment_ids } })
      this.updateBlocklistAkismetWithComment(todoComments, status, referer)
    } catch (error) {
      logger.warn(`batchPatchStatus to ${status} failed!`, error)
    }
    return actionResult
  }

  public async batchDelete(commentIds: MongooseId[], postIds: number[]) {
    const result = await this.commentModel.deleteMany({ _id: { $in: commentIds } }).exec()
    this.updateCommentsCountWithArticles(postIds)
    return result
  }

  public async countDocuments(
    queryFilter: QueryFilter<Comment>,
    queryOptions?: MongooseBaseQueryOptions<Comment>
  ): Promise<number> {
    return await this.commentModel.countDocuments(queryFilter, queryOptions).exec()
  }

  public async getTotalCount(publicOnly: boolean): Promise<number> {
    return await this.countDocuments(publicOnly ? COMMENT_GUEST_QUERY_FILTER : {})
  }

  public async getCalendar(publicOnly: boolean, timezone = 'GMT') {
    try {
      const calendar = await this.commentModel.aggregate<{ _id: string; count: number }>([
        { $match: publicOnly ? COMMENT_GUEST_QUERY_FILTER : {} },
        { $project: { day: { $dateToString: { date: '$created_at', format: '%Y-%m-%d', timezone } } } },
        { $group: { _id: '$day', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ])
      return calendar.map(({ _id, ...rest }) => ({ ...rest, date: _id }))
    } catch (error: unknown) {
      throw new BadRequestException(`Invalid timezone identifier: '${timezone}'`, String(error))
    }
  }

  public async reviseIPLocation(commentId: MongooseId) {
    const comment = await this.getDetailByObjectId(commentId)
    if (!comment.ip) {
      throw new BadRequestException(`Comment '${commentId}' hasn't IP address`)
    }

    const location = await this.ipService.queryLocation(comment.ip)
    if (!location) {
      throw new InternalServerErrorException(`Failed to resolve location for IP: ${comment.ip}`)
    }

    comment.ip_location = { ...location }
    return await comment.save()
  }

  // Vote comment
  public async vote(commentId: number, isLike: boolean) {
    const comment = await this.getDetailByNumberId(commentId)
    isLike ? comment.likes++ : comment.dislikes++
    await comment.save({ timestamps: false })
    return {
      likes: comment.likes,
      dislikes: comment.dislikes
    }
  }
}
