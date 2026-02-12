/**
 * @file Disqus public service
 * @module module/disqus/service
 * @author Surmon <https://github.com/surmon-china>
 */

import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common'
import { QueryVisitor } from '@app/decorators/request-context.decorator'
import { CommentService } from '@app/modules/comment/comment.service'
import { Comment, CommentBaseWithExtras } from '@app/modules/comment/comment.model'
import { CommentStatus } from '@app/modules/comment/comment.constant'
import { CommentDisqusExtraKeys } from '@app/constants/extras.constant'
import { getDisqusCacheKey } from '@app/constants/cache.constant'
import { CacheService } from '@app/core/cache/cache.service'
import { DISQUS } from '@app/app.config'
import { Disqus } from '@app/utils/disqus'
import { getExtrasMap, getExtraValue } from '@app/transformers/extra.transformer'
import { getPermalinkById } from '@app/transformers/urlmap.transformer'
import { DisqusPrivateService } from './disqus.service.private'
import { createLogger } from '@app/utils/logger'
import { isDevEnv } from '@app/app.environment'
import { DISQUS_OAUTH_CALLBACK_URL } from './disqus.helper'

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
    return this.disqus.getAuthorizeURL('code', 'read,write', DISQUS_OAUTH_CALLBACK_URL)
  }

  public async getAccessToken(code: string) {
    return this.disqus.getOAuthAccessToken(code, DISQUS_OAUTH_CALLBACK_URL).catch((error) => {
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
    return this.disqus.request('threads/vote', params, { asPublic: true }).catch((error) => {
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
      return getExtraValue(comment.extras, CommentDisqusExtraKeys.PostId) || null
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
      // Authenticated Disqus User
      body.access_token = accessToken
    } else {
      // Guest User (Acting as Moderator)
      body.author_email = comment.author.email
      body.author_name = comment.author.name
      body.author_url = comment.author.site
    }

    return (
      this.disqus
        // https://groups.google.com/g/disqus-dev/c/9HBAftO0jr0
        // NOTE: Extensive research and testing confirm that the Disqus API does not support creating anonymous comments with state='approved'.
        // Consequently, we utilize a community Public Key for guest posts.
        // These comments will automatically enter a "Pending" status and cannot be replied to directly.
        .request('posts/create', body, { asPublic: !accessToken })
        .then((response) => response.response)
        .catch((error) => {
          logger.warn('createDisqusComment failed!', error)
          return Promise.reject(error)
        })
    )
  }

  public async createUniversalComment(comment: CommentBaseWithExtras, visitor: QueryVisitor, accessToken?: string) {
    const newComment = this.commentService.normalizeNewComment(comment, visitor)
    await Promise.all([
      // 1. commentable
      this.commentService.verifyTargetCommentable(newComment.post_id),
      // 2. nodepress blocklist
      this.commentService.verifyCommentValidity(newComment)
    ])
    // 3. make sure disqus thread
    const thread = await this.ensureThreadDetailCache(newComment.post_id)
    // 4. disqus parent comment post ID
    let parentId: string | null = null
    if (newComment.pid) {
      parentId = await this.getDisqusPostIdByCommentId(newComment.pid)
    }
    // 5. create disqus post (comment)
    const disqusPost = await this.createDisqusComment({
      comment: newComment,
      threadId: thread.id,
      parentId: parentId,
      accessToken
    })
    // 6. approve guest post
    // https://groups.google.com/g/disqus-dev/c/DcAZqSE0QSc/m/i-Az_1hKcvIJ
    if (disqusPost.author.isAnonymous && !disqusPost.isApproved) {
      await this.disqusPrivateService.approvePost({ post: disqusPost.id, newUserPremodBypass: 1 }).catch(() => {})
    }
    // 7. create nodepress comment
    newComment.author.name = disqusPost.author.name || newComment.author.name
    newComment.author.site = disqusPost.author.url || newComment.author.site
    newComment.extras.push(
      { key: CommentDisqusExtraKeys.PostId, value: disqusPost.id },
      { key: CommentDisqusExtraKeys.ThreadId, value: disqusPost.thread }
    )
    if (disqusPost.author.isAnonymous || !accessToken) {
      // guest comment
      newComment.extras.push({ key: CommentDisqusExtraKeys.Anonymous, value: 'true' })
    } else {
      // disqus user comment
      newComment.extras.push(
        { key: CommentDisqusExtraKeys.AuthorId, value: disqusPost.author.id },
        { key: CommentDisqusExtraKeys.AuthorUsername, value: disqusPost.author.username }
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
    const extrasMap = getExtrasMap(comment.extras)
    const commentDisqusPostId = extrasMap.get(CommentDisqusExtraKeys.PostId)
    const commentDisqusAuthorId = extrasMap.get(CommentDisqusExtraKeys.AuthorId)
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
    return await this.commentService.update(comment._id, { status: CommentStatus.Trash })
  }
}
