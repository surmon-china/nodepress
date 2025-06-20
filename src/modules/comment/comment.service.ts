/**
 * @file Comment service
 * @module module/comment/service
 * @author Surmon <https://github.com/surmon-china>
 */

import { Injectable } from '@nestjs/common'
import { FilterQuery, MongooseBaseQueryOptions } from 'mongoose'
import { InjectModel } from '@app/transformers/model.transformer'
import { MongooseModel, MongooseDoc, MongooseId } from '@app/interfaces/mongoose.interface'
import { PaginateResult, PaginateQuery, PaginateOptions } from '@app/utils/paginate'
import { GUESTBOOK_POST_ID, CommentState } from '@app/constants/biz.constant'
import { ArticleService } from '@app/modules/article/article.service'
import { IPService } from '@app/processors/helper/helper.service.ip'
import { EmailService } from '@app/processors/helper/helper.service.email'
import { AkismetService, AkismetAction } from '@app/processors/helper/helper.service.akismet'
import { QueryVisitor } from '@app/decorators/queryparams.decorator'
import { OptionService } from '@app/modules/option/option.service'
import { getPermalinkById } from '@app/transformers/urlmap.transformer'
import { Comment, CommentBase, COMMENT_GUEST_QUERY_FILTER } from './comment.model'
import { CommentsStateDTO } from './comment.dto'
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
    private readonly optionService: OptionService,
    private readonly articleService: ArticleService,
    @InjectModel(Comment) private readonly commentModel: MongooseModel<Comment>
  ) {}

  private async emailToAdminAndTargetAuthor(comment: Comment) {
    let onWhere = ''
    if (comment.post_id === GUESTBOOK_POST_ID) {
      onWhere = 'guestbook'
    } else {
      const article = await this.articleService.getDetailByNumberIdOrSlug({ idOrSlug: comment.post_id })
      onWhere = `"${article.toObject().title}"`
    }

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

    // email to admin
    const subject = `You have a new comment`
    this.emailService.sendMailAs(APP_CONFIG.APP_BIZ.FE_NAME, {
      to: APP_CONFIG.APP_BIZ.ADMIN_EMAIL,
      subject,
      ...getMailContent(subject)
    })

    // email to parent comment author
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
    // filter invalid post_id & guestbook
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
        await this.articleService.updateMetaComments(postIds[0], 0)
      } else {
        await Promise.all(
          counts.map((count) => {
            return this.articleService.updateMetaComments(count._id, count.num_tutorial)
          })
        )
      }
    } catch (error) {
      logger.warn('updateCommentCountWithArticle failed!', error)
    }
  }

  // comment state effects
  private updateBlocklistAkismetWithComment(comments: Comment[], state: CommentState, referer?: string) {
    const isSPAM = state === CommentState.Spam
    const action = isSPAM ? AkismetAction.SubmitSpam : AkismetAction.SubmitHam
    // SPAM > append to blocklist & submitSpam
    // HAM > remove from blocklist & submitHAM
    // Akismet
    comments.forEach((comment) => this.submitCommentAkismet(action, comment, referer))
    // block list
    const ips: string[] = comments.map((comment) => comment.ip!).filter(Boolean)
    const emails: string[] = comments.map((comment) => comment.author.email!).filter(Boolean)
    const blocklistAction = isSPAM
      ? this.optionService.appendToBlocklist({ ips, emails })
      : this.optionService.removeFromBlocklist({ ips, emails })
    blocklistAction
      .then(() => logger.info('updateBlocklistAkismetWithComment.blocklistAction succeeded.'))
      .catch((error) => logger.warn('updateBlocklistAkismetWithComment.blocklistAction failed!', error))
  }

  // validate comment by NodePress IP/email/keywords
  public async verifyCommentValidity(comment: Comment): Promise<void> {
    const { blocklist } = await this.optionService.ensureAppOption()
    const { keywords, mails, ips } = blocklist
    const blockIP = ips.includes(comment.ip!)
    const blockEmail = mails.includes(comment.author.email!)
    const blockKeyword = keywords.length && new RegExp(`${keywords.join('|')}`, 'ig').test(comment.content)
    const isBlocked = blockIP || blockEmail || blockKeyword
    if (isBlocked) {
      return Promise.reject('content | email | IP > blocked')
    }
  }

  // validate comment target commentable
  public async verifyTargetCommentable(targetPostId: number): Promise<void> {
    if (targetPostId !== GUESTBOOK_POST_ID) {
      const isCommentable = await this.articleService.isCommentableArticle(targetPostId)
      if (!isCommentable) {
        return Promise.reject(`Comment target ${targetPostId} was disabled comment`)
      }
    }
  }

  public getAll(): Promise<Array<Comment>> {
    return this.commentModel.find().exec()
  }

  // get comment list for client user
  public async paginator(
    query: PaginateQuery<Comment>,
    options: PaginateOptions,
    hideIPEmail = false
  ): Promise<PaginateResult<Comment>> {
    // MARK: can't use 'lean' with virtual 'email_hash'
    // MARK: can't use select('-email') with virtual 'email_hash'
    // https://github.com/Automattic/mongoose/issues/3130#issuecomment-395750197
    const result = await this.commentModel.paginate(query, options)
    if (!hideIPEmail) {
      return result
    }

    return {
      ...result,
      documents: result.documents.map((item) => {
        const data = item.toJSON()
        Reflect.deleteProperty(data, 'ip')
        Reflect.deleteProperty(data.author, 'email')
        return data as Comment
      })
    }
  }

  public normalizeNewComment(comment: CommentBase, visitor: QueryVisitor): Comment {
    return {
      ...comment,
      pid: Number(comment.pid),
      post_id: Number(comment.post_id),
      state: CommentState.Published,
      likes: 0,
      dislikes: 0,
      ip: visitor.ip,
      ip_location: {},
      agent: visitor.ua || comment.agent,
      extends: []
    }
  }

  // create comment
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

  // create comment from client
  public async createFormClient(comment: CommentBase, visitor: QueryVisitor): Promise<MongooseDoc<Comment>> {
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

  // get comment detail by ObjectID
  public getDetailByObjectId(commentId: MongooseId): Promise<MongooseDoc<Comment>> {
    return this.commentModel
      .findById(commentId)
      .exec()
      .then((result) => result || Promise.reject(`Comment '${commentId}' not found`))
  }

  // get comment detail by number ID
  public getDetailByNumberId(commentId: number): Promise<MongooseDoc<Comment>> {
    return this.commentModel
      .findOne({ id: commentId })
      .exec()
      .then((result) => result || Promise.reject(`Comment '${commentId}' not found`))
  }

  // update comment
  public async update(
    commentId: MongooseId,
    newComment: Partial<Comment>,
    referer?: string
  ): Promise<MongooseDoc<Comment>> {
    const comment = await this.commentModel.findByIdAndUpdate(commentId, newComment, { new: true }).exec()
    if (!comment) {
      throw `Comment '${commentId}' not found`
    }

    this.updateCommentsCountWithArticles([comment.post_id])
    this.updateBlocklistAkismetWithComment([comment], comment.state, referer)
    return comment
  }

  // delete comment
  public async delete(commentId: MongooseId) {
    const comment = await this.commentModel.findByIdAndDelete(commentId, null).exec()
    if (!comment) {
      throw `Comment '${commentId}' not found`
    }

    this.updateCommentsCountWithArticles([comment.post_id])
    return comment
  }

  public async batchPatchState(action: CommentsStateDTO, referer?: string) {
    const { comment_ids, post_ids, state } = action
    const actionResult = await this.commentModel
      .updateMany({ _id: { $in: comment_ids } }, { $set: { state } }, { multi: true })
      .exec()
    // update ref article.meta.comments
    this.updateCommentsCountWithArticles(post_ids)
    try {
      const todoComments = await this.commentModel.find({ _id: { $in: comment_ids } })
      this.updateBlocklistAkismetWithComment(todoComments, state, referer)
    } catch (error) {
      logger.warn(`batchPatchState to ${state} failed!`, error)
    }
    return actionResult
  }

  public async batchDelete(commentIds: MongooseId[], postIds: number[]) {
    const result = await this.commentModel.deleteMany({ _id: { $in: commentIds } }).exec()
    this.updateCommentsCountWithArticles(postIds)
    return result
  }

  public async countDocuments(
    filter: FilterQuery<Comment>,
    options?: MongooseBaseQueryOptions<Comment>
  ): Promise<number> {
    return await this.commentModel.countDocuments(filter, options).exec()
  }

  public async getTotalCount(publicOnly: boolean): Promise<number> {
    return await this.countDocuments(publicOnly ? COMMENT_GUEST_QUERY_FILTER : {})
  }

  public getCalendar(publicOnly: boolean, timezone = 'GMT') {
    return this.commentModel
      .aggregate<{ _id: string; count: number }>([
        { $match: publicOnly ? COMMENT_GUEST_QUERY_FILTER : {} },
        { $project: { day: { $dateToString: { date: '$created_at', format: '%Y-%m-%d', timezone } } } },
        { $group: { _id: '$day', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ])
      .then((calendar) => calendar.map(({ _id, ...r }) => ({ ...r, date: _id })))
      .catch(() => Promise.reject(`Invalid timezone identifier: '${timezone}'`))
  }

  public async reviseIPLocation(commentId: MongooseId) {
    const comment = await this.getDetailByObjectId(commentId)
    if (!comment.ip) {
      return `Comment '${commentId}' hasn't IP address`
    }

    const location = await this.ipService.queryLocation(comment.ip)
    if (!location) {
      return `Empty location query result`
    }

    comment.ip_location = { ...location }
    return await comment.save()
  }

  // vote comment
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
