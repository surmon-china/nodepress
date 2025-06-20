/**
 * @file Vote controller
 * @module module/vote/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import _isUndefined from 'lodash/isUndefined'
import { UAParser } from 'ua-parser-js'
import { Controller, Get, Post, Delete, Body, Query, UseGuards } from '@nestjs/common'
import { Throttle, minutes, seconds } from '@nestjs/throttler'
import { AdminOnlyGuard } from '@app/guards/admin-only.guard'
import { ExposePipe } from '@app/pipes/expose.pipe'
import { Responser } from '@app/decorators/responser.decorator'
import { PaginateResult, PaginateQuery, PaginateOptions } from '@app/utils/paginate'
import { QueryParams, QueryParamsResult } from '@app/decorators/queryparams.decorator'
import { IPService, IPLocation } from '@app/processors/helper/helper.service.ip'
import { EmailService } from '@app/processors/helper/helper.service.email'
import { OptionService } from '@app/modules/option/option.service'
import { ArticleService } from '@app/modules/article/article.service'
import { CommentService } from '@app/modules/comment/comment.service'
import { Author } from '@app/modules/comment/comment.model'
import { DisqusPublicService } from '@app/modules/disqus/disqus.service.public'
import { DisqusToken } from '@app/modules/disqus/disqus.token'
import { AccessToken } from '@app/utils/disqus'
import { GUESTBOOK_POST_ID } from '@app/constants/biz.constant'
import { getPermalinkById } from '@app/transformers/urlmap.transformer'
import { CommentVoteDTO, PostVoteDTO, VotePaginateQueryDTO, VotesDTO } from './vote.dto'
import { Vote, VoteTarget, VoteAuthorType, voteTypeMap } from './vote.model'
import { VoteService } from './vote.service'
import * as APP_CONFIG from '@app/app.config'

@Controller('vote')
export class VoteController {
  constructor(
    private readonly ipService: IPService,
    private readonly emailService: EmailService,
    private readonly disqusPublicService: DisqusPublicService,
    private readonly commentService: CommentService,
    private readonly articleService: ArticleService,
    private readonly optionService: OptionService,
    private readonly voteService: VoteService
  ) {}

  private async queryIPLocation(ip: string | null) {
    return ip ? await this.ipService.queryLocation(ip) : null
  }

  private async getPostTitle(postId: number) {
    if (postId === GUESTBOOK_POST_ID) {
      return 'guestbook'
    } else {
      const article = await this.articleService.getDetailByNumberIdOrSlug({ idOrSlug: postId })
      return article.toObject().title
    }
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
      const userType = `Disqus ${isAdmin ? `moderator` : 'user'}`
      return [`${disqusUser.name} (${userType})`, disqusUser.profileUrl].filter(Boolean).join(' · ')
    }

    // local guest user
    if (voteAuthor.type === VoteAuthorType.Guest) {
      const guestUser = voteAuthor.data
      return [`${guestUser.name} (Guest user)`, guestUser.site].filter(Boolean).join(' · ')
    }

    // anonymous user
    return `Anonymous user`
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
    const getLocationText = (location: IPLocation) => {
      return [location.country, location.region, location.city].join(' · ')
    }

    const getAgentText = (ua: string) => {
      const parsed = UAParser(ua)
      return [
        `${parsed.browser.name ?? 'unknown_browser'}@${parsed.browser.version ?? 'unknown'}`,
        `${parsed.os.name ?? 'unknown_OS'}@${parsed.os.version ?? 'unknown'}`,
        `${parsed.device.model ?? 'unknown_device'}@${parsed.device.vendor ?? 'unknown'}`
      ].join(' · ')
    }

    const mailTexts = [
      `${payload.subject} on "${payload.on}".`,
      `Vote: ${payload.vote}`,
      `Author: ${payload.author}`,
      `Location: ${payload.location ? getLocationText(payload.location) : 'unknown'}`,
      `Agent: ${payload.userAgent ? getAgentText(payload.userAgent) : 'unknown'}`
    ]
    const textHTML = mailTexts.map((text) => `<p>${text}</p>`).join('')
    const linkHTML = `<a href="${payload.link}" target="_blank">${payload.on}</a>`

    this.emailService.sendMailAs(APP_CONFIG.APP_BIZ.FE_NAME, {
      to: payload.to,
      subject: payload.subject,
      text: mailTexts.join('\n'),
      html: [textHTML, `<br>`, linkHTML].join('\n')
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
  @Responser.paginate()
  @Responser.handle('Get votes')
  getVotes(@Query(ExposePipe) query: VotePaginateQueryDTO): Promise<PaginateResult<Vote>> {
    const { sort, page, per_page, ...filters } = query
    const paginateQuery: PaginateQuery<Vote> = {}
    const paginateOptions: PaginateOptions = { page, perPage: per_page, dateSort: sort }
    // target type
    if (!_isUndefined(filters.target_type)) {
      paginateQuery.target_type = filters.target_type
    }
    // target ID
    if (!_isUndefined(filters.target_id)) {
      paginateQuery.target_id = filters.target_id
    }
    // vote type
    if (!_isUndefined(filters.vote_type)) {
      paginateQuery.vote_type = filters.vote_type
    }
    // author type
    if (!_isUndefined(filters.author_type)) {
      paginateQuery.author_type = filters.author_type
    }
    return this.voteService.paginator(paginateQuery, paginateOptions)
  }

  @Delete()
  @UseGuards(AdminOnlyGuard)
  @Responser.handle('Delete votes')
  deleteVotes(@Body() body: VotesDTO) {
    return this.voteService.batchDelete(body.vote_ids)
  }

  @Post('/post')
  @Throttle({ default: { ttl: minutes(1), limit: 10 } })
  @Responser.handle('Vote post')
  async votePost(
    @Body() voteBody: PostVoteDTO,
    @DisqusToken() token: AccessToken | null,
    @QueryParams() { visitor }: QueryParamsResult
  ) {
    // NodePress
    const likes =
      voteBody.post_id === GUESTBOOK_POST_ID
        ? await this.optionService.incrementLikes()
        : await this.articleService.incrementLikes(voteBody.post_id)
    // Disqus
    this.voteDisqusThread(voteBody.post_id, voteBody.vote, token?.access_token).catch(() => {})
    // author
    this.getVoteAuthor({ guestAuthor: voteBody.author, disqusToken: token?.access_token }).then(
      async (voteAuthor) => {
        // location
        const ipLocation = await this.queryIPLocation(visitor.ip)
        // database
        await this.voteService.create({
          target_type: VoteTarget.Post,
          target_id: voteBody.post_id,
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
          subject: `You have a new post vote`,
          on: await this.getPostTitle(voteBody.post_id),
          vote: voteTypeMap.get(voteBody.vote)!,
          author: this.getAuthorString(voteAuthor),
          userAgent: visitor.ua,
          location: ipLocation,
          link: getPermalinkById(voteBody.post_id)
        })
      }
    )

    return likes
  }

  @Post('/comment')
  @Throttle({ default: { ttl: seconds(30), limit: 10 } })
  @Responser.handle('Vote comment')
  async voteComment(
    @Body() voteBody: CommentVoteDTO,
    @DisqusToken() token: AccessToken | null,
    @QueryParams() { visitor }: QueryParamsResult
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
        const comment = await this.commentService.getDetailByNumberId(voteBody.comment_id)
        const targetTitle = await this.getPostTitle(comment.post_id)
        // email to author and admin
        const mailPayload = {
          vote: voteTypeMap.get(voteBody.vote)!,
          on: `${targetTitle} #${comment.id}`,
          author: this.getAuthorString(voteAuthor),
          userAgent: visitor.ua,
          location: ipLocation,
          link: getPermalinkById(comment.post_id) + `#comment-${comment.id}`
        }
        // email to admin
        this.emailToTargetVoteMessage({
          to: APP_CONFIG.APP_BIZ.ADMIN_EMAIL,
          subject: `You have a new comment vote`,
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
