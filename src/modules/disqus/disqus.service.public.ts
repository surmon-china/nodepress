/**
 * @file Disqus public service
 * @module module/disqus/service
 * @author Surmon <https://github.com/surmon-china>
 */

import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common'
import { CommentService } from '@app/modules/comment/comment.service'
import { Comment, CommentBase } from '@app/modules/comment/comment.model'
import { QueryVisitor } from '@app/decorators/request-context.decorator'
import { CommentState } from '@app/constants/biz.constant'
import { getDisqusCacheKey } from '@app/constants/cache.constant'
import { CacheService } from '@app/core/cache/cache.service'
import { DISQUS } from '@app/app.config'
import { Disqus } from '@app/utils/disqus'
import { getExtendObject, getExtendValue } from '@app/transformers/extend.transformer'
import { getPermalinkById } from '@app/transformers/urlmap.transformer'
import { DisqusPrivateService } from './disqus.service.private'
import { createLogger } from '@app/utils/logger'
import { isDevEnv } from '@app/app.environment'
import * as DISQUS_CONST from './disqus.constant'

const logger = createLogger({ scope: 'DisqusPublicService', time: isDevEnv })

@Injectable()
export class DisqusPublicService {
  private disqus: Disqus

  constructor(
    private readonly cacheService: CacheService,
    private readonly commentService: CommentService,
    private readonly disqusPrivateService: DisqusPrivateService
  ) {
    this.disqus = new Disqus({
      apiKey: DISQUS.publicKey,
      apiSecret: DISQUS.secretKey
    })
  }

  private getUserInfoCacheKey(uid: string | number) {
    return getDisqusCacheKey(`userinfo-${uid}`)
  }

  public setUserInfoCache(uid: string | number, userInfo: any, ttl: number) {
    return this.cacheService.set(this.getUserInfoCacheKey(uid), userInfo, ttl)
  }

  public getUserInfoCache(uid: string | number) {
    return this.cacheService.get<any>(this.getUserInfoCacheKey(uid))
  }

  public deleteUserInfoCache(uid: string | number) {
    return this.cacheService.delete(this.getUserInfoCacheKey(uid))
  }

  public getAuthorizeURL() {
    return this.disqus.getAuthorizeURL('code', 'read,write', DISQUS_CONST.DISQUS_OAUTH_CALLBACK_URL)
  }

  public async getAccessToken(code: string) {
    return this.disqus.getOAuthAccessToken(code, DISQUS_CONST.DISQUS_OAUTH_CALLBACK_URL).catch((error) => {
      logger.warn('getAccessToken failed!', error)
      return Promise.reject(error)
    })
  }

  public async refreshAccessToken(refreshToken: string) {
    return this.disqus.refreshOAuthAccessToken(refreshToken).catch((error) => {
      logger.warn('refreshAccessToken failed!', error)
      return Promise.reject(error)
    })
  }

  public getUserInfo(accessToken: string) {
    return this.disqus
      .request('users/details', { access_token: accessToken })
      .then((response) => response.response)
      .catch((error) => {
        logger.warn('getUserInfo failed!', error)
        return Promise.reject(error)
      })
  }

  public ensureThreadDetail(postId: number) {
    return this.disqus
      .request('threads/details', { forum: DISQUS.forum, thread: `link:${getPermalinkById(postId)}` })
      .then((response) => response.response)
      .catch(() => this.disqusPrivateService.createThread(postId))
  }

  public async ensureThreadDetailCache(postId: number) {
    const cacheKey = getDisqusCacheKey(`thread-post-${postId}`)
    const cached = await this.cacheService.get<any>(cacheKey)
    if (cached) {
      return cached
    }
    const result = await this.ensureThreadDetail(postId)
    // cache 24 hours
    this.cacheService.set(cacheKey, result, 60 * 60 * 24)
    return result
  }

  public async voteThread(params: any) {
    // https://disqus.com/api/docs/threads/vote/
    return this.disqus.request('threads/vote', params, true).catch((error) => {
      logger.warn('voteThread failed!', error)
      return Promise.reject(error)
    })
  }

  public async votePost(params: any) {
    // https://disqus.com/api/docs/posts/vote/
    return this.disqus.request('posts/vote', params).catch((error) => {
      logger.warn('votePost failed!', error)
      return Promise.reject(error)
    })
  }

  public async getDisqusPostIdByCommentId(commentId: number): Promise<string | null> {
    try {
      const comment = await this.commentService.getDetailByNumberId(commentId)
      return getExtendValue(comment.extends, DISQUS_CONST.COMMENT_POST_ID_EXTEND_KEY) || null
    } catch (error) {
      return null
    }
  }

  public async createDisqusComment(payload: {
    comment: Comment
    threadId: string
    parentId: string | null
    accessToken?: string
  }) {
    const { comment, threadId, parentId, accessToken } = payload
    // https://disqus.com/api/docs/posts/create/
    const body: any = {
      message: comment.content,
      parent: parentId,
      thread: threadId
    }
    if (accessToken) {
      // publish by Disqus user
      body.access_token = accessToken
    } else {
      // publish by guest user
      body.author_email = comment.author.email
      body.author_name = comment.author.name
      body.author_url = comment.author.site
    }

    return (
      this.disqus
        // guest comment must use Disqus Public API key (when no accessToken)
        .request('posts/create', body, !accessToken)
        .then((response) => response.response)
        .catch((error) => {
          logger.warn('createDisqusComment failed!', error)
          return Promise.reject(error)
        })
    )
  }

  public async createUniversalComment(comment: CommentBase, visitor: QueryVisitor, accessToken?: string) {
    const newComment = this.commentService.normalizeNewComment(comment, visitor)
    // 1. commentable
    await this.commentService.verifyTargetCommentable(newComment.post_id)
    // 2. make sure disqus thread
    const thread = await this.ensureThreadDetailCache(newComment.post_id)
    // 3. nodepress blocklist
    await this.commentService.verifyCommentValidity(newComment)
    // 4. disqus parent comment post ID
    let parentId: string | null = null
    if (newComment.pid) {
      parentId = await this.getDisqusPostIdByCommentId(newComment.pid)
    }
    // 5. create disqus post(comment)
    const disqusPost = await this.createDisqusComment({
      comment: newComment,
      threadId: thread.id,
      parentId: parentId,
      accessToken
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
        logger.warn('deleteDisqusComment failed!', error)
        return Promise.reject(error)
      })
  }

  public async deleteUniversalComment(commentId: number, accessToken: string) {
    // comment
    const comment = await this.commentService.getDetailByNumberId(commentId)
    if (!comment) throw new NotFoundException(`Comment '${commentId}' not found`)

    // disqus extend info
    const extendsObject = getExtendObject(comment.extends)
    const commentDisqusPostId = extendsObject[DISQUS_CONST.COMMENT_POST_ID_EXTEND_KEY]
    const commentDisqusAuthorId = extendsObject[DISQUS_CONST.COMMENT_AUTHOR_ID_EXTEND_KEY]
    if (!commentDisqusAuthorId || !commentDisqusPostId) {
      throw new BadRequestException(`Comment '${commentId}' cannot be deleted (missing Disqus metadata)`)
    }

    // user ID === author ID
    const userInfo = await this.getUserInfo(accessToken)
    if (userInfo.id !== commentDisqusAuthorId) {
      throw new ForbiddenException(`You do not have permission to delete comment '${commentId}'`)
    }

    // disqus delete
    await this.deleteDisqusComment({
      post: commentDisqusPostId,
      access_token: accessToken
    })

    // NodePress delete
    return await this.commentService.update(comment._id, { state: CommentState.Deleted })
  }
}
