/**
 * @file Vote controller
 * @module module/vote/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import _isUndefined from 'lodash/isUndefined'
import type { QueryFilter } from 'mongoose'
import { Controller, Get, Post, Delete, Body, Query, UseGuards } from '@nestjs/common'
import { Throttle, minutes, seconds } from '@nestjs/throttler'
import { AdminOnlyGuard } from '@app/guards/admin-only.guard'
import { SuccessResponse } from '@app/decorators/success-response.decorator'
import { PaginateOptions, PaginateResult } from '@app/utils/paginate'
import { RequestContext, IRequestContext } from '@app/decorators/request-context.decorator'
import { IPService, IPLocation } from '@app/core/helper/helper.service.ip'
import { EmailService } from '@app/core/helper/helper.service.email'
import { ArticleService } from '@app/modules/article/article.service'
import { CommentService } from '@app/modules/comment/comment.service'
import { Author } from '@app/modules/comment/comment.model'
import { DisqusPublicService } from '@app/modules/disqus/disqus.service.public'
import { DisqusToken } from '@app/modules/disqus/disqus.token'
import { AccessToken } from '@app/utils/disqus'
import { GUESTBOOK_POST_ID } from '@app/constants/biz.constant'
import { getPermalinkById } from '@app/transformers/urlmap.transformer'
import { getLocationText, getUserAgentText } from '@app/transformers/email.transformer'
import { CommentVoteDTO, ArticleVoteDTO, VotePaginateQueryDTO, VotesDTO } from './vote.dto'
import { VoteTarget, VoteAuthorType, voteTypesMap } from './vote.constant'
import { VoteService } from './vote.service'
import { Vote } from './vote.model'
import * as APP_CONFIG from '@app/app.config'

@Controller('vote')
export class VoteController {
  constructor(
    private readonly ipService: IPService,
    private readonly emailService: EmailService,
    private readonly disqusPublicService: DisqusPublicService,
    private readonly commentService: CommentService,
    private readonly articleService: ArticleService,
    private readonly voteService: VoteService
  ) {}

  private async queryIPLocation(ip: string | null) {
    return ip ? await this.ipService.queryLocation(ip) : null
  }

  private async getPostTitle(postId: number) {
    return postId === GUESTBOOK_POST_ID
      ? 'guestbook'
      : await this.articleService
          .getDetailByNumberIdOrSlug({ numberId: postId, lean: true })
          .then((article) => article.title)
  }

  private async getVoteAuthor(payload: { guestAuthor?: Author; disqusToken?: string }) {
    const { guestAuthor, disqusToken } = payload ?? {}
    // Disqus user
    if (disqusToken) {
      try {
        const disqusUserInfo = await this.disqusPublicService.getUserInfo(disqusToken)
        return {
          type: VoteAuthorType.Disqus,
          data: {
            id: disqusUserInfo.id,
            name: disqusUserInfo.name,
            username: disqusUserInfo.username,
            url: disqusUserInfo.url,
            profileUrl: disqusUserInfo.profileUrl
          }
        }
      } catch (error) {}
    }

    // local guest user
    if (guestAuthor) {
      return {
        type: VoteAuthorType.Guest,
        data: guestAuthor
      }
    }

    // anonymous user
    return {
      type: VoteAuthorType.Anonymous,
      data: null
    }
  }

  private getAuthorString(voteAuthor: { type: VoteAuthorType; data: any }) {
    // Disqus user
    if (voteAuthor.type === VoteAuthorType.Disqus) {
      const disqusUser = voteAuthor.data
      const isAdmin = disqusUser.username === APP_CONFIG.DISQUS.adminUsername
      const userType = `Disqus ${isAdmin ? 'moderator' : 'user'}`
      return [`${disqusUser.name} (${userType})`, disqusUser.profileUrl].filter(Boolean).join(' · ')
    }

    // local guest user
    if (voteAuthor.type === VoteAuthorType.Guest) {
      const guestUser = voteAuthor.data
      return [`${guestUser.name} (Guest user)`, guestUser.site].filter(Boolean).join(' · ')
    }

    // anonymous user
    return 'Anonymous user'
  }

  private emailToTargetVoteMessage(payload: {
    subject: string
    to: string
    on: string
    link: string
    vote: string
    author: string
    userAgent?: string
    location?: IPLocation | null
  }) {
    const lines = [
      `${payload.subject} on "${payload.on}".`,
      `Vote: ${payload.vote}`,
      `Author: ${payload.author}`,
      `Location: ${payload.location ? getLocationText(payload.location) : 'unknown'}`,
      `UserAgent: ${payload.userAgent ? getUserAgentText(payload.userAgent) : 'unknown'}`
    ]

    this.emailService.sendMailAs(APP_CONFIG.APP_BIZ.FE_NAME, {
      to: payload.to,
      subject: payload.subject,
      text: lines.join('\n'),
      html: [
        lines.map((text) => `<p>${text}</p>`).join(''),
        `<br>`,
        `<a href="${payload.link}" target="_blank">${payload.on}</a>`
      ].join('\n')
    })
  }

  // Disqus logged-in user or guest user
  async voteDisqusThread(postId: number, vote: number, token?: string) {
    const thread = await this.disqusPublicService.ensureThreadDetailCache(postId)
    const result = await this.disqusPublicService.voteThread({
      access_token: token || null,
      thread: thread.id,
      vote
    })
    // console.info(`Disqus like thread ${postId}`, result)
    return result
  }

  @Get()
  @UseGuards(AdminOnlyGuard)
  @SuccessResponse({ message: 'Get votes succeeded', usePaginate: true })
  getVotes(@Query() query: VotePaginateQueryDTO): Promise<PaginateResult<Vote>> {
    const { sort, page, per_page, ...filters } = query
    const queryFilter: QueryFilter<Vote> = {}
    const paginateOptions: PaginateOptions = { page, perPage: per_page, dateSort: sort }
    // target type
    if (!_isUndefined(filters.target_type)) {
      queryFilter.target_type = filters.target_type
    }
    // target ID
    if (!_isUndefined(filters.target_id)) {
      queryFilter.target_id = filters.target_id
    }
    // vote type
    if (!_isUndefined(filters.vote_type)) {
      queryFilter.vote_type = filters.vote_type
    }
    // author type
    if (!_isUndefined(filters.author_type)) {
      queryFilter.author_type = filters.author_type
    }

    return this.voteService.paginate(queryFilter, paginateOptions)
  }

  @Delete()
  @UseGuards(AdminOnlyGuard)
  @SuccessResponse('Delete votes succeeded')
  deleteVotes(@Body() body: VotesDTO) {
    return this.voteService.batchDelete(body.vote_ids)
  }

  @Post('/article')
  @Throttle({ default: { ttl: minutes(1), limit: 10 } })
  @SuccessResponse('Vote article succeeded')
  async votePost(
    @Body() voteBody: ArticleVoteDTO,
    @DisqusToken() token: AccessToken | null,
    @RequestContext() { visitor }: IRequestContext
  ) {
    // NodePress
    const likes = await this.articleService.incrementStatistics(voteBody.article_id, 'likes')
    // Disqus
    this.voteDisqusThread(voteBody.article_id, voteBody.vote, token?.access_token).catch(() => {})
    // author
    this.getVoteAuthor({ guestAuthor: voteBody.author, disqusToken: token?.access_token }).then(
      async (voteAuthor) => {
        // IP location
        const ipLocation = await this.queryIPLocation(visitor.ip)
        // database
        await this.voteService.create({
          target_type: VoteTarget.Article,
          target_id: voteBody.article_id,
          vote_type: voteBody.vote,
          author_type: voteAuthor.type,
          author: voteAuthor.data,
          user_agent: visitor.ua,
          ip: visitor.ip,
          ip_location: ipLocation
        })

        // email to admin
        this.emailToTargetVoteMessage({
          to: APP_CONFIG.APP_BIZ.ADMIN_EMAIL,
          subject: 'You have a new post vote',
          on: await this.getPostTitle(voteBody.article_id),
          vote: voteTypesMap.get(voteBody.vote)!,
          author: this.getAuthorString(voteAuthor),
          userAgent: visitor.ua,
          location: ipLocation,
          link: getPermalinkById(voteBody.article_id)
        })
      }
    )

    return likes
  }

  @Post('/comment')
  @Throttle({ default: { ttl: seconds(30), limit: 10 } })
  @SuccessResponse('Vote comment succeeded')
  async voteComment(
    @Body() voteBody: CommentVoteDTO,
    @DisqusToken() token: AccessToken | null,
    @RequestContext() { visitor }: IRequestContext
  ) {
    // NodePress
    const result = await this.commentService.vote(voteBody.comment_id, voteBody.vote > 0)

    // Disqus only logged-in user
    if (token) {
      try {
        const postId = await this.disqusPublicService.getDisqusPostIdByCommentId(voteBody.comment_id)
        if (postId) {
          await this.disqusPublicService.votePost({
            access_token: token.access_token,
            post: postId,
            vote: voteBody.vote
          })
          // console.info(`Disqus like post ${voteBody.comment_id}`, result)
        }
      } catch (error) {}
    }

    // effects
    this.getVoteAuthor({ guestAuthor: voteBody.author, disqusToken: token?.access_token }).then(
      async (voteAuthor) => {
        // location
        const ipLocation = await this.queryIPLocation(visitor.ip)
        // database
        await this.voteService.create({
          target_type: VoteTarget.Comment,
          target_id: voteBody.comment_id,
          vote_type: voteBody.vote,
          author_type: voteAuthor.type,
          author: voteAuthor.data,
          user_agent: visitor.ua,
          ip: visitor.ip,
          ip_location: ipLocation
        })

        // email to author and admin
        const comment = await this.commentService.getDetailByNumberId(voteBody.comment_id)
        const targetTitle = await this.getPostTitle(comment.post_id)
        const mailPayload = {
          vote: voteTypesMap.get(voteBody.vote)!,
          on: `${targetTitle} #${comment.id}`,
          author: this.getAuthorString(voteAuthor),
          userAgent: visitor.ua,
          location: ipLocation,
          link: getPermalinkById(comment.post_id) + `#comment-${comment.id}`
        }

        // email to admin
        this.emailToTargetVoteMessage({
          to: APP_CONFIG.APP_BIZ.ADMIN_EMAIL,
          subject: 'You have a new comment vote',
          ...mailPayload
        })

        // email to author
        if (comment.author.email) {
          this.emailToTargetVoteMessage({
            to: comment.author.email,
            subject: `Your comment #${comment.id} has a new vote`,
            ...mailPayload
          })
        }
      }
    )

    return result
  }
}
