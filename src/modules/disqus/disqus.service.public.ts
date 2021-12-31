/**
 * @file Disqus public service
 * @module module/disqus/service
 * @author Surmon <https://github.com/surmon-china>
 */

import { Injectable } from '@nestjs/common'
import { CommentService } from '@app/modules/comment/comment.service'
import { Comment, CreateCommentBase } from '@app/modules/comment/comment.model'
import { QueryVisitor } from '@app/decorators/query-params.decorator'
import { CommentState } from '@app/interfaces/biz.interface'
import { DISQUS } from '@app/app.config'
import { Disqus } from '@app/utils/disqus'
import { isProdEnv } from '@app/app.environment'
import { getExtendsObject, getExtendValue } from '@app/transformers/extend.transformer'
import { getPermalinkByID } from '@app/transformers/urlmap.transformer'
import { DisqusPrivateService } from './disqus.service.private'
import logger from '@app/utils/logger'
import * as DISQUS_CONST from './disqus.constant'

@Injectable()
export class DisqusPublicService {
  private disqus: Disqus

  constructor(
    private readonly commentService: CommentService,
    private readonly disqusPrivateService: DisqusPrivateService
  ) {
    this.disqus = new Disqus({
      apiKey: DISQUS.publicKey,
      apiSecret: DISQUS.secretKey,
    })
  }

  public getAuthorizeURL() {
    return this.disqus.getAuthorizeURL('code', 'read,write', DISQUS_CONST.DISQUS_OAUTH_CALLBACK_URL)
  }

  public async getAccessToken(code: string) {
    return this.disqus.getOAuthAccessToken(code, DISQUS_CONST.DISQUS_OAUTH_CALLBACK_URL).catch((error) => {
      logger.warn('[disqus]', 'getAccessToken', error)
      return Promise.reject(error)
    })
  }

  public async refreshAccessToken(refreshToken: string) {
    return this.disqus.refreshOAuthAccessToken(refreshToken).catch((error) => {
      logger.warn('[disqus]', 'refreshAccessToken', error)
      return Promise.reject(error)
    })
  }

  public getUserInfo(accessToken: string) {
    return this.disqus
      .request('users/details', { access_token: accessToken })
      .then((response) => response.response)
      .catch((error) => {
        logger.warn('[disqus]', 'getUserInfo', error)
        return Promise.reject(error)
      })
  }

  public makeSureThreadDetail(postID: number) {
    return this.disqus
      .request('threads/details', { forum: DISQUS.forum, thread: `link:${getPermalinkByID(postID)}` })
      .then((response) => response.response)
      .catch(() => this.disqusPrivateService.createThread(postID))
  }

  public async voteThread(params: any) {
    // https://disqus.com/api/docs/threads/vote/
    return this.disqus.request('threads/vote', params, true).catch((error) => {
      logger.warn('[disqus]', 'voteThread', error)
      return Promise.reject(error)
    })
  }

  public async votePost(params: any) {
    //disqus.com/api/docs/posts/vote/
    https: return this.disqus.request('posts/vote', params).catch((error) => {
      logger.warn('[disqus]', 'votePost', error)
      return Promise.reject(error)
    })
  }

  public async getDisqusPostIDByCommentID(commentID: number): Promise<string | null> {
    try {
      const comment = await this.commentService.getDetailByNumberID(commentID)
      return getExtendValue(comment.extends, DISQUS_CONST.COMMENT_POST_ID_EXTEND_KEY) || null
    } catch (error) {
      return null
    }
  }

  public async createDisqusComment(payload: {
    comment: Comment
    threadID: string
    parentID: string | null
    accessToken?: string
  }) {
    const { comment, threadID, parentID, accessToken } = payload
    // https://disqus.com/api/docs/posts/create/
    const body: any = {
      message: comment.content,
      parent: parentID,
      thread: threadID,
    }
    if (accessToken) {
      // publish by Disqus user
      body.access_token = accessToken
    } else {
      // publish by guest user
      body.author_email = comment.author.email
      body.author_name = comment.author.name
      body.author_url = comment.author.site
      body.ip_address = isProdEnv ? comment.ip : null
    }

    return (
      this.disqus
        // guest comment must use Disqus Public API key (when no accessToken)
        .request('posts/create', body, !accessToken)
        .then((response) => response.response)
        .catch((error) => {
          logger.warn('[disqus]', 'createDisqusComment', error)
          return Promise.reject(error)
        })
    )
  }

  public async createUniversalComment(comment: CreateCommentBase, visitor: QueryVisitor, accessToken?: string) {
    const newComment = this.commentService.normalizeNewComment(comment, visitor)
    // 1. commentable
    await this.commentService.isCommentableTarget(newComment.post_id)
    // 2. make sure disqus thread
    const thread = await this.makeSureThreadDetail(newComment.post_id)
    // 3. nodepress blocklist
    await this.commentService.isNotBlocklisted(newComment)
    // 4. disqus parent comment post ID
    let parentID: string | null = null
    if (Boolean(newComment.pid)) {
      parentID = await this.getDisqusPostIDByCommentID(newComment.pid)
    }
    // 5. create disqus post(comment)
    const disqusPost = await this.createDisqusComment({
      comment: newComment,
      threadID: thread.id,
      parentID,
      accessToken,
    })
    // 6. approve guest post
    // https://groups.google.com/g/disqus-dev/c/DcAZqSE0QSc/m/i-Az_1hKcvIJ
    if (disqusPost.author.isAnonymous && !disqusPost.isApproved) {
      try {
        await this.disqusPrivateService.approvePost({ post: disqusPost.id, newUserPremodBypass: 1 })
      } catch (error) {}
    }
    // 7. create nodepress comment
    newComment.author.name = disqusPost.author.name || newComment.author.name
    newComment.author.site = disqusPost.author.url || newComment.author.site
    newComment.extends.push(
      { name: DISQUS_CONST.COMMENT_POST_ID_EXTEND_KEY, value: disqusPost.id },
      { name: DISQUS_CONST.COMMENT_THREAD_ID_EXTEND_KEY, value: disqusPost.thread }
    )
    if (disqusPost.author.isAnonymous || !accessToken) {
      // guest comment
      newComment.extends.push({ name: DISQUS_CONST.COMMENT_ANONYMOUS_EXTEND_KEY, value: 'true' })
    } else {
      // disqus user comment
      newComment.extends.push(
        { name: DISQUS_CONST.COMMENT_AUTHOR_ID_EXTEND_KEY, value: disqusPost.author.id },
        { name: DISQUS_CONST.COMMENT_AUTHOR_USERNAME_EXTEND_KEY, value: disqusPost.author.username }
      )
    }

    return await this.commentService.create(newComment)
  }

  public async deleteDisqusComment(params: any) {
    return this.disqus
      .request('posts/remove', params)
      .then((response) => response.response)
      .catch((error) => {
        logger.warn('[disqus]', 'deleteDisqusComment', error)
        return Promise.reject(error)
      })
  }

  public async deleteUniversalComment(commentID: number, accessToken: string) {
    // comment
    const comment = await this.commentService.getDetailByNumberID(commentID)
    if (!comment) {
      throw 'Comment not found'
    }

    // disqus extend info
    const extendsObject = getExtendsObject(comment.extends)
    const commentDisqusPostID = extendsObject[DISQUS_CONST.COMMENT_POST_ID_EXTEND_KEY]
    const commentDisqusAuthorID = extendsObject[DISQUS_CONST.COMMENT_AUTHOR_ID_EXTEND_KEY]
    if (!commentDisqusAuthorID || !commentDisqusPostID) {
      throw 'Comment not deleteable'
    }

    // user ID === author ID
    const userInfo = await this.getUserInfo(accessToken)
    if (userInfo.id !== commentDisqusAuthorID) {
      throw `You do not have write privileges on comment ${commentID}`
    }

    // disqus delete
    const result = await this.deleteDisqusComment({
      post: commentDisqusPostID,
      access_token: accessToken,
    })

    // NodePress delete
    return await this.commentService.update(comment._id, { state: CommentState.Deleted })
  }
}
