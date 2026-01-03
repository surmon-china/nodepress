/**
 * @file Disqus private service
 * @module module/disqus/service
 * @author Surmon <https://github.com/surmon-china>
 */

import dayjs from 'dayjs'
import { XMLParser } from 'fast-xml-parser'
import { Injectable, BadRequestException } from '@nestjs/common'
import { ArticleService } from '@app/modules/article/article.service'
import { CommentService } from '@app/modules/comment/comment.service'
import { Comment } from '@app/modules/comment/comment.model'
import { Article } from '@app/modules/article/article.model'
import { GUESTBOOK_POST_ID, CommentState } from '@app/constants/biz.constant'
import { getExtendObject } from '@app/transformers/extend.transformer'
import { getPermalinkById } from '@app/transformers/urlmap.transformer'
import { DISQUS } from '@app/app.config'
import { Disqus } from '@app/utils/disqus'
import { isDevEnv } from '@app/app.environment'
import { createLogger } from '@app/utils/logger'
import { GeneralDisqusParams } from './disqus.dto'
import { getDisqusXML } from './disqus.xml'
import * as DISQUS_CONST from './disqus.constant'

const logger = createLogger({ scope: 'DisqusPrivateService', time: isDevEnv })

@Injectable()
export class DisqusPrivateService {
  private disqus: Disqus

  constructor(
    private readonly articleService: ArticleService,
    private readonly commentService: CommentService
  ) {
    this.disqus = new Disqus({
      apiKey: DISQUS.publicKey,
      apiSecret: DISQUS.secretKey
    })
  }

  public async createThread(postId: number) {
    try {
      const article = await this.articleService.getDetailByNumberIdOrSlug({
        numberId: postId,
        publicOnly: true,
        lean: true
      })
      // https://disqus.com/api/docs/threads/create/
      const response = await this.disqus.request('threads/create', {
        forum: DISQUS.forum,
        identifier: DISQUS_CONST.getThreadIdentifierById(postId),
        title: article.title,
        message: article.description,
        slug: article.slug || DISQUS_CONST.getThreadIdentifierById(postId),
        date: dayjs(article.created_at).unix(),
        url: getPermalinkById(postId),
        access_token: DISQUS.adminAccessToken
      })
      return response.response
    } catch (error) {
      logger.warn('createThread failed!', postId, error)
      throw error
    }
  }

  public async getThreads(params: GeneralDisqusParams) {
    // https://disqus.com/api/docs/threads/list/
    return this.disqus
      .request('threads/list', {
        access_token: DISQUS.adminAccessToken,
        forum: DISQUS.forum,
        ...params
      })
      .catch((error) => {
        logger.warn('getThreads failed!', error)
        return Promise.reject(error)
      })
  }

  public async getPosts(params: GeneralDisqusParams) {
    // https://disqus.com/api/docs/posts/list/
    return this.disqus
      .request('posts/list', {
        access_token: DISQUS.adminAccessToken,
        forum: DISQUS.forum,
        ...params
      })
      .catch((error) => {
        logger.warn('getPosts failed!', error)
        return Promise.reject(error)
      })
  }

  public async updateThread(params: any) {
    // https://disqus.com/api/docs/threads/update/
    return this.disqus
      .request('threads/update', {
        access_token: DISQUS.adminAccessToken,
        ...params
      })
      .catch((error) => {
        logger.warn('updateThread failed!', error)
        return Promise.reject(error)
      })
  }

  public async updatePost(params: any) {
    // https://disqus.com/api/docs/posts/update/
    return this.disqus
      .request('posts/update', {
        access_token: DISQUS.adminAccessToken,
        ...params
      })
      .catch((error) => {
        logger.warn('updatePost failed!', error)
        return Promise.reject(error)
      })
  }

  public async approvePost(params: any) {
    // https://disqus.com/api/docs/posts/approve/
    return this.disqus
      .request('posts/approve', {
        access_token: DISQUS.adminAccessToken,
        ...params
      })
      .catch((error) => {
        logger.warn('approvePost failed!', error)
        return Promise.reject(error)
      })
  }

  // export NodePress to Disqus
  // https://help.disqus.com/en/articles/1717222-custom-xml-import-format
  public async exportXMLFromNodepress(): Promise<string> {
    const treeMap = new Map<number, { comments: Array<Comment>; article: Article }>()
    const guestbook: Comment[] = []

    // 1. get comments
    const allComments = await this.commentService.getAll()
    const todoComments = allComments.filter((comment) =>
      [CommentState.Auditing, CommentState.Published].includes(comment.state)
    )
    const todoCommentIds = todoComments.map((comment) => comment.id)
    todoComments.forEach((comment) => {
      if (comment.pid && !todoCommentIds.includes(comment.pid)) {
        comment.pid = 0
      }
      if (comment.post_id === GUESTBOOK_POST_ID) {
        guestbook.push(comment)
      } else if (treeMap.has(comment.post_id)) {
        treeMap.get(comment.post_id)!.comments.push(comment)
      } else {
        treeMap.set(comment.post_id, { comments: [comment] } as any)
      }
    })

    // 2. map comment postIds & get articles
    const articleIds = Array.from(treeMap.keys())
    const articles = await this.articleService.getList(articleIds)
    articles.forEach((article) => {
      if (treeMap.has(article.id)) {
        treeMap.get(article.id)!.article = article
      }
    })

    // 3. make XML data
    const treeList = Array.from(treeMap.values()).filter((item) => Boolean(item.article))
    return getDisqusXML(treeList, guestbook)
  }

  // import Disqus data to NodePress
  // https://help.disqus.com/en/articles/1717164-comments-export
  public async importXMLToNodepress(xmlFileBuffer: Buffer) {
    const parser = new XMLParser({
      ignoreAttributes: false,
      allowBooleanAttributes: true,
      attributeNamePrefix: '@'
    })
    const object = parser.parse(xmlFileBuffer)
    const posts: any[] = object?.disqus?.post
    if (!posts || !Array.isArray(posts)) {
      throw new BadRequestException('Invalid XML format: missing disqus.post')
    }

    // filter new data
    const filtered = posts.filter((post) => Boolean(post.id))
    const getEach = (post: any) => ({
      commentId: Number(post.id.replace(`wp_id=`, '')),
      postId: post['@dsq:id'] as string,
      threadId: post.thread['@dsq:id'] as string,
      isAnonymous: post.author.isAnonymous as boolean,
      username: (post.author.username as string) || null
    })

    const doImport = async (each: ReturnType<typeof getEach>) => {
      if (!Number.isFinite(each.commentId)) {
        throw `Invalid comment ID '${each.commentId}'`
      }

      const comment = await this.commentService.getDetailByNumberId(each.commentId)
      if (!comment) {
        throw `Invalid comment '${comment}'`
      }

      const _extends = comment.extends || []
      const extendsObject = getExtendObject(_extends)
      // post ID
      if (!extendsObject[DISQUS_CONST.COMMENT_POST_ID_EXTEND_KEY]) {
        _extends.push({ name: DISQUS_CONST.COMMENT_POST_ID_EXTEND_KEY, value: each.postId })
      }
      // thread ID
      if (!extendsObject[DISQUS_CONST.COMMENT_THREAD_ID_EXTEND_KEY]) {
        _extends.push({ name: DISQUS_CONST.COMMENT_THREAD_ID_EXTEND_KEY, value: each.threadId })
      }
      // guest(anonymous) | disqus user
      if (each.isAnonymous) {
        if (!extendsObject[DISQUS_CONST.COMMENT_ANONYMOUS_EXTEND_KEY]) {
          _extends.push({ name: DISQUS_CONST.COMMENT_ANONYMOUS_EXTEND_KEY, value: 'true' })
        }
      } else if (each.username) {
        if (!extendsObject[DISQUS_CONST.COMMENT_AUTHOR_USERNAME_EXTEND_KEY]) {
          _extends.push({ name: DISQUS_CONST.COMMENT_AUTHOR_USERNAME_EXTEND_KEY, value: each.username })
        }
      }
      comment.extends = _extends
      return await comment.save()
    }

    const done: any[] = []
    const fail: any[] = []
    for (const post of filtered) {
      const each = getEach(post)
      try {
        await doImport(each)
        done.push(each)
      } catch (error) {
        fail.push(each)
      }
    }

    logger.info('import XML', { done: done.length, fail: fail.length })
    return { done, fail }
  }
}
