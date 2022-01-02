/**
 * @file Comment service
 * @module module/comment/service
 * @author Surmon <https://github.com/surmon-china>
 */

import { Types } from 'mongoose'
import { DocumentType } from '@typegoose/typegoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@app/transformers/model.transformer'
import { MongooseModel } from '@app/interfaces/mongoose.interface'
import { PaginateResult, PaginateOptions } from '@app/utils/paginate'
import { CommentPostID, CommentState } from '@app/interfaces/biz.interface'
import { ArticleService } from '@app/modules/article/article.service'
import { IPService } from '@app/processors/helper/helper.service.ip'
import { EmailService } from '@app/processors/helper/helper.service.email'
import { AkismetService, AkismetActionType } from '@app/processors/helper/helper.service.akismet'
import { QueryVisitor } from '@app/decorators/query-params.decorator'
import { OptionService } from '@app/modules/option/option.service'
import { getPermalinkByID } from '@app/transformers/urlmap.transformer'
import { Comment, CreateCommentBase, CommentsStatePayload } from './comment.model'
import { isProdEnv } from '@app/app.environment'
import logger from '@app/utils/logger'
import * as APP_CONFIG from '@app/app.config'

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

  private emailToAdminAndTargetAuthor(comment: Comment) {
    const isGuestbook = comment.post_id === CommentPostID.Guestbook
    const onWhere = isGuestbook ? 'guestbook' : 'article-' + comment.post_id

    const getMailTexts = (contentPrefix = '') => [
      `You have a new comment ${contentPrefix} on ${onWhere}.`,
      `${comment.author.name}: ${comment.content}`,
    ]

    const getMailHtml = (contentPrefix = '') => `
      ${getMailTexts(contentPrefix)
        .map((t) => `<p>${t}</p>`)
        .join('')}
      <br>
      <a href="${getPermalinkByID(comment.post_id)}" target="_blank">Reply to ${comment.author.name}</a>
    `

    // email to admin
    this.emailService.sendMail({
      to: APP_CONFIG.EMAIL.admin,
      subject: `[${APP_CONFIG.APP.FE_NAME}] You have a new comment`,
      text: getMailTexts().join('\n'),
      html: getMailHtml(),
    })

    // email to parent comment author
    if (comment.pid) {
      this.commentModel.findOne({ id: comment.pid }).then((parentComment) => {
        if (parentComment?.author.email) {
          this.emailService.sendMail({
            to: parentComment.author.email,
            subject: `[${APP_CONFIG.APP.FE_NAME}] You have a new comment reply`,
            text: getMailTexts(`(reply)`).join('\n'),
            html: getMailHtml(`(reply)`),
          })
        }
      })
    }
  }

  private submitCommentAkismet(action: AkismetActionType, comment: Comment, referer?: string): Promise<void> {
    return this.akismetService[action]({
      user_ip: comment.ip!,
      user_agent: comment.agent!,
      referrer: referer || '',
      permalink: getPermalinkByID(comment.post_id),
      comment_type: comment.pid ? 'reply' : 'comment',
      comment_author: comment.author.name,
      comment_author_email: comment.author.email,
      comment_author_url: comment.author.site,
      comment_content: comment.content,
    })
  }

  // 更新当前所受影响的文章的评论聚合数据
  private async updateCommentCountWithArticle(postIDs: number[]) {
    // filter invalid post_id & guestbook
    postIDs = postIDs || []
    postIDs = postIDs.map(Number).filter(Boolean)
    if (!postIDs.length) {
      return false
    }

    try {
      const counts = await this.commentModel.aggregate([
        { $match: { state: CommentState.Published, post_id: { $in: postIDs } } },
        { $group: { _id: '$post_id', num_tutorial: { $sum: 1 } } },
      ])
      if (!counts || !counts.length) {
        await this.articleService.updateMetaComments(postIDs[0], 0)
      } else {
        await Promise.all(
          counts.map((count) => this.articleService.updateMetaComments(count._id, count.num_tutorial))
        )
      }
    } catch (error) {
      logger.warn('[comment]', 'updateCommentCountWithArticle failed!', error)
    }
  }

  // 根据操作状态处理评论转移，处理评论状态转移
  private updateBlocklistAkismetWithComment(comments: Comment[], state: CommentState, referrer?: string) {
    const isSPAM = state === CommentState.Spam
    const action = isSPAM ? AkismetActionType.SubmitSpam : AkismetActionType.SubmitHam
    //  SPAM > append to blocklist & submitSpam
    //  HAM > remove from blocklist & submitHAM
    // akismet
    comments.forEach((comment) => this.submitCommentAkismet(action, comment, referrer))
    // block list
    const ips: string[] = comments.map((comment) => comment.ip!).filter(Boolean)
    const emails: string[] = comments.map((comment) => comment.author.email!).filter(Boolean)
    const blocklistAction = isSPAM
      ? this.optionService.appendToBlocklist({ ips, emails })
      : this.optionService.removeFromBlocklist({ ips, emails })
    blocklistAction
      .then(() => logger.info('[comment]', 'updateBlocklistAkismetWithComment.blocklistAction > succeed'))
      .catch((error) => logger.warn('[comment]', 'updateBlocklistAkismetWithComment.blocklistAction > failed', error))
  }

  // validate comment by NodePress IP/email/keywords
  public async isNotBlocklisted(comment: Comment): Promise<void> {
    const { blocklist } = await this.optionService.getAppOption()
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
  public async isCommentableTarget(targetPostID: number): Promise<void> {
    if (targetPostID !== CommentPostID.Guestbook) {
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
  public async paginater(querys, options: PaginateOptions, hideIPEmail = false): Promise<PaginateResult<Comment>> {
    // MARK: can't use 'lean' with virtual 'email_hash'
    // MARK: can't use select('-email') with virtual 'email_hash'
    // https://github.com/Automattic/mongoose/issues/3130#issuecomment-395750197
    const result = await this.commentModel.paginate(querys, options)
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
      }),
    }
  }

  public normalizeNewComment(comment: CreateCommentBase, visitor: QueryVisitor): Comment {
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
      extends: [],
    }
  }

  // create comment
  public async create(comment: Comment): Promise<Comment> {
    const ip_location = isProdEnv && comment.ip ? await this.ipService.queryLocation(comment.ip) : null
    const succeedComment = await this.commentModel.create({
      ...comment,
      ip_location,
    })
    // update aggregate & email notification
    this.updateCommentCountWithArticle([succeedComment.post_id])
    this.emailToAdminAndTargetAuthor(succeedComment)
    return succeedComment
  }

  // create comment from client
  public async createFormClient(comment: CreateCommentBase, visitor: QueryVisitor): Promise<Comment> {
    const newComment = this.normalizeNewComment(comment, visitor)
    // 1. check commentable
    await this.isCommentableTarget(newComment.post_id)
    // 2. block list | akismet
    await Promise.all([
      this.isNotBlocklisted(newComment),
      this.submitCommentAkismet(AkismetActionType.CheckSpam, newComment, visitor.referer),
    ])
    // 3. create
    return this.create(newComment)
  }

  // get comment detail by ObjectID
  public getDetailByObjectID(commentID: Types.ObjectId): Promise<DocumentType<Comment>> {
    return this.commentModel
      .findById(commentID)
      .exec()
      .then((result) => result || Promise.reject(`Comment "${commentID}" not found`))
  }

  // get comment detail by number ID
  public getDetailByNumberID(commentID: number): Promise<DocumentType<Comment>> {
    return this.commentModel
      .findOne({ id: commentID })
      .exec()
      .then((result) => result || Promise.reject(`Comment "${commentID}" not found`))
  }

  // vote comment
  public async vote(commentID: number, isLike: boolean) {
    const comment = await this.getDetailByNumberID(commentID)
    isLike ? comment.likes++ : comment.dislikes++
    await comment.save()
    return {
      likes: comment.likes,
      dislikes: comment.dislikes,
    }
  }

  // update comment
  public async update(commentID: Types.ObjectId, newComment: Partial<Comment>, referer?: string): Promise<Comment> {
    const comment = await this.commentModel.findByIdAndUpdate(commentID, newComment, { new: true }).exec()
    if (!comment) {
      throw `Comment "${commentID}" not found`
    }

    this.updateCommentCountWithArticle([comment.post_id])
    this.updateBlocklistAkismetWithComment([comment], comment.state, referer)
    return comment
  }

  // delete comment
  public async delete(commentID: Types.ObjectId): Promise<Comment> {
    const comment = await this.commentModel.findByIdAndRemove(commentID).exec()
    if (!comment) {
      throw `Comment "${commentID}" not found`
    }

    this.updateCommentCountWithArticle([comment.post_id])
    return comment
  }

  public async batchPatchState(action: CommentsStatePayload, referer: string) {
    const { comment_ids, post_ids, state } = action
    const actionResult = await this.commentModel
      .updateMany({ _id: { $in: comment_ids } }, { $set: { state } }, { multi: true })
      .exec()
    // 更新关联数据
    this.updateCommentCountWithArticle(post_ids)
    try {
      const todoComments = await this.commentModel.find({ _id: { $in: comment_ids } })
      this.updateBlocklistAkismetWithComment(todoComments, state, referer)
    } catch (error) {
      logger.warn('[comment]', `对评论进行改变状态 ${state} 时，出现查询错误！`, error)
    }
    return actionResult
  }

  public async batchDelete(commentIDs: Types.ObjectId[], postIDs: number[]) {
    const result = await this.commentModel.deleteMany({ _id: { $in: commentIDs } }).exec()
    this.updateCommentCountWithArticle(postIDs)
    return result
  }

  public async reviseIPLocation(commentID: Types.ObjectId) {
    const comment = await this.getDetailByObjectID(commentID)
    if (!comment.ip) {
      return `Comment "${commentID}" hasn't IP address`
    }

    const location = await this.ipService.queryLocation(comment.ip)
    if (!location) {
      return `Empty location query result`
    }

    comment.ip_location = { ...location }
    return await comment.save()
  }
}
