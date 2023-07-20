/**
 * @file Comment service
 * @module module/comment/service
 * @author Surmon <https://github.com/surmon-china>
 */

import { Injectable } from '@nestjs/common'
import { InjectModel } from '@app/transformers/model.transformer'
import { MongooseModel, MongooseDoc, MongooseID } from '@app/interfaces/mongoose.interface'
import { PaginateResult, PaginateQuery, PaginateOptions } from '@app/utils/paginate'
import { GUESTBOOK_POST_ID, CommentState } from '@app/constants/biz.constant'
import { ArticleService } from '@app/modules/article/article.service'
import { IPService } from '@app/processors/helper/helper.service.ip'
import { EmailService } from '@app/processors/helper/helper.service.email'
import { AkismetService, AkismetAction } from '@app/processors/helper/helper.service.akismet'
import { QueryVisitor } from '@app/decorators/queryparams.decorator'
import { OptionService } from '@app/modules/option/option.service'
import { getPermalinkByID } from '@app/transformers/urlmap.transformer'
import { Comment, CommentBase, COMMENT_GUEST_QUERY_FILTER } from './comment.model'
import { CommentsStateDTO } from './comment.dto'
import { isProdEnv } from '@app/app.environment'
import logger from '@app/utils/logger'
import * as APP_CONFIG from '@app/app.config'

const log = logger.scope('CommentService')

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
      const article = await this.articleService.getDetailByNumberIDOrSlug({ idOrSlug: comment.post_id })
      onWhere = `"${article.toObject().title}"`
    }

    const authorName = comment.author.name
    const getMailContent = (subject = '') => {
      const texts = [`${subject} on ${onWhere}.`, `${authorName}: ${comment.content}`]
      const textHTML = texts.map((text) => `<p>${text}</p>`).join('')
      const linkHTML = `<a href="${getPermalinkByID(comment.post_id)}" target="_blank">Reply to ${authorName}</a>`
      return {
        text: texts.join('\n'),
        html: [textHTML, `<br>`, linkHTML].join('\n')
      }
    }

    // email to admin
    const subject = `You have a new comment`
    this.emailService.sendMailAs(APP_CONFIG.APP.FE_NAME, {
      to: APP_CONFIG.APP.ADMIN_EMAIL,
      subject,
      ...getMailContent(subject)
    })

    // email to parent comment author
    if (comment.pid) {
      this.commentModel.findOne({ id: comment.pid }).then((parentComment) => {
        if (parentComment?.author.email) {
          const subject = `Your comment #${parentComment.id} has a new reply`
          this.emailService.sendMailAs(APP_CONFIG.APP.FE_NAME, {
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
      permalink: getPermalinkByID(comment.post_id),
      comment_type: comment.pid ? 'reply' : 'comment',
      comment_author: comment.author.name,
      comment_author_email: comment.author.email,
      comment_author_url: comment.author.site,
      comment_content: comment.content
    })
  }

  private async updateCommentsCountWithArticles(postIDs: number[]) {
    // filter invalid post_id & guestbook
    postIDs = postIDs.map(Number).filter(Boolean)
    if (!postIDs.length) {
      return false
    }

    try {
      const counts = await this.commentModel.aggregate<{ _id: number; num_tutorial: number }>([
        { $match: { ...COMMENT_GUEST_QUERY_FILTER, post_id: { $in: postIDs } } },
        { $group: { _id: '$post_id', num_tutorial: { $sum: 1 } } }
      ])
      if (!counts || !counts.length) {
        await this.articleService.updateMetaComments(postIDs[0], 0)
      } else {
        await Promise.all(
          counts.map((count) => {
            return this.articleService.updateMetaComments(count._id, count.num_tutorial)
          })
        )
      }
    } catch (error) {
      log.warn('updateCommentCountWithArticle failed!', error)
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
      .then(() => log.info('updateBlocklistAkismetWithComment.blocklistAction succeed.'))
      .catch((error) => log.warn('updateBlocklistAkismetWithComment.blocklistAction failed!', error))
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
  public async verifyTargetCommentable(targetPostID: number): Promise<void> {
    if (targetPostID !== GUESTBOOK_POST_ID) {
      const isCommentable = await this.articleService.isCommentableArticle(targetPostID)
      if (!isCommentable) {
        return Promise.reject(`Comment target ${targetPostID} was disabled comment`)
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
    const succeedComment = await this.commentModel.create({
      ...comment,
      ip_location
    })
    // update aggregate & email notification
    this.updateCommentsCountWithArticles([succeedComment.post_id])
    this.emailToAdminAndTargetAuthor(succeedComment)
    return succeedComment
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
  public getDetailByObjectID(commentID: MongooseID): Promise<MongooseDoc<Comment>> {
    return this.commentModel
      .findById(commentID)
      .exec()
      .then((result) => result || Promise.reject(`Comment '${commentID}' not found`))
  }

  // get comment detail by number ID
  public getDetailByNumberID(commentID: number): Promise<MongooseDoc<Comment>> {
    return this.commentModel
      .findOne({ id: commentID })
      .exec()
      .then((result) => result || Promise.reject(`Comment '${commentID}' not found`))
  }

  // update comment
  public async update(
    commentID: MongooseID,
    newComment: Partial<Comment>,
    referer?: string
  ): Promise<MongooseDoc<Comment>> {
    const comment = await this.commentModel.findByIdAndUpdate(commentID, newComment, { new: true }).exec()
    if (!comment) {
      throw `Comment '${commentID}' not found`
    }

    this.updateCommentsCountWithArticles([comment.post_id])
    this.updateBlocklistAkismetWithComment([comment], comment.state, referer)
    return comment
  }

  // delete comment
  public async delete(commentID: MongooseID): Promise<MongooseDoc<Comment>> {
    const comment = await this.commentModel.findByIdAndRemove(commentID).exec()
    if (!comment) {
      throw `Comment '${commentID}' not found`
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
      log.warn(`batchPatchState to ${state} failed!`, error)
    }
    return actionResult
  }

  public async batchDelete(commentIDs: MongooseID[], postIDs: number[]) {
    const result = await this.commentModel.deleteMany({ _id: { $in: commentIDs } }).exec()
    this.updateCommentsCountWithArticles(postIDs)
    return result
  }

  public async getTotalCount(publicOnly: boolean): Promise<number> {
    return await this.commentModel.countDocuments(publicOnly ? COMMENT_GUEST_QUERY_FILTER : {}).exec()
  }

  public async reviseIPLocation(commentID: MongooseID) {
    const comment = await this.getDetailByObjectID(commentID)
    if (!comment.ip) {
      return `Comment '${commentID}' hasn't IP address`
    }

    const location = await this.ipService.queryLocation(comment.ip)
    if (!location) {
      return `Empty location query result`
    }

    comment.ip_location = { ...location }
    return await comment.save()
  }

  // vote comment
  public async vote(commentID: number, isLike: boolean) {
    const comment = await this.getDetailByNumberID(commentID)
    isLike ? comment.likes++ : comment.dislikes++
    await comment.save({ timestamps: false })
    return {
      likes: comment.likes,
      dislikes: comment.dislikes
    }
  }
}
