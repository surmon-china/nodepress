/**
 * @file Vote controller
 * @module module/vote/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import { Controller, Post, Body } from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import { UAParser } from 'ua-parser-js'
import { Responser } from '@app/decorators/responser.decorator'
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
import { getPermalinkByID } from '@app/transformers/urlmap.transformer'
import { VoteAuthorDTO, CommentVoteDTO, PageVoteDTO } from './vote.dto'
import * as APP_CONFIG from '@app/app.config'

@Controller('vote')
export class VoteController {
  constructor(
    private readonly ipService: IPService,
    private readonly emailService: EmailService,
    private readonly disqusPublicService: DisqusPublicService,
    private readonly commentService: CommentService,
    private readonly articleService: ArticleService,
    private readonly optionService: OptionService
  ) {}

  private async queryIPLocation(ip: string | null) {
    return ip ? await this.ipService.queryLocation(ip) : null
  }

  private async getAuthor(payload: { guestAuthor?: Author; disqusToken?: string }) {
    const { guestAuthor, disqusToken } = payload ?? {}
    // Disqus user
    if (disqusToken) {
      try {
        const userInfo = await this.disqusPublicService.getUserInfo(disqusToken)
        const isAdmin = userInfo.username === APP_CONFIG.DISQUS.adminUsername
        const userType = `Disqus ${isAdmin ? `moderator` : 'user'}`
        return [`${userInfo.name} (${userType})`, userInfo.profileUrl].filter(Boolean).join(' · ')
      } catch (error) {}
    }

    // local guest user
    if (guestAuthor) {
      return [`${guestAuthor.name} (Guest user)`, guestAuthor.site].filter(Boolean).join(' · ')
    }

    // anonymous user
    return `Anonymous user`
  }

  private async getTargetTitle(post_id: number) {
    if (post_id === GUESTBOOK_POST_ID) {
      return 'guestbook'
    } else {
      const article = await this.articleService.getDetailByNumberIDOrSlug({ idOrSlug: post_id })
      return article.toObject().title
    }
  }

  // Email to target
  // 1. site vote
  // 2. article vote
  // 3. comment vote
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
      const uaResult = new UAParser(ua).getResult()
      return [
        `${uaResult.browser.name ?? 'unknown browser'}@${uaResult.browser.version ?? 'unknown'}`,
        `${uaResult.os.name ?? 'unknown OS'}@${uaResult.os.version ?? 'unknown'}`,
        `${uaResult.device.model ?? 'unknown device'}@${uaResult.device.vendor ?? 'unknown'}`,
      ].join(' · ')
    }

    const mailTexts = [
      `${payload.subject} on "${payload.on}".`,
      `Vote: ${payload.vote}`,
      `Author: ${payload.author}`,
      `Location: ${payload.location ? getLocationText(payload.location) : 'unknown'}`,
      `Agent: ${payload.userAgent ? getAgentText(payload.userAgent) : 'unknown'}`,
    ]
    const textHTML = mailTexts.map((text) => `<p>${text}</p>`).join('')
    const linkHTML = `<a href="${payload.link}" target="_blank">${payload.on}</a>`

    this.emailService.sendMailAs(APP_CONFIG.APP.FE_NAME, {
      to: payload.to,
      subject: payload.subject,
      text: mailTexts.join('\n'),
      html: [textHTML, `<br>`, linkHTML].join('\n'),
    })
  }

  // Disqus logged-in user or guest user
  async voteDisqusThread(articleID: number, vote: number, token?: string) {
    const thread = await this.disqusPublicService.ensureThreadDetailCache(articleID)
    const result = await this.disqusPublicService.voteThread({
      access_token: token || null,
      thread: thread.id,
      vote,
    })
    // console.info(`Disqus like thread ${articleID}`, result)
    return result
  }

  // 1 hour > limit 10
  @Throttle(10, 60 * 60)
  @Post('/site')
  @Responser.handle('Vote site')
  async likeSite(
    @Body() voteBody: VoteAuthorDTO,
    @DisqusToken() token: AccessToken | null,
    @QueryParams() { visitor }: QueryParamsResult
  ) {
    // NodePress
    const likes = await this.optionService.incrementLikes()
    // Disqus
    this.voteDisqusThread(GUESTBOOK_POST_ID, 1, token?.access_token).catch(() => {})
    // email to admin
    this.getAuthor({ guestAuthor: voteBody.author, disqusToken: token?.access_token }).then(async (author) => {
      this.emailToTargetVoteMessage({
        to: APP_CONFIG.APP.ADMIN_EMAIL,
        subject: `You have a new site vote`,
        on: await this.getTargetTitle(GUESTBOOK_POST_ID),
        vote: '+1',
        author,
        userAgent: visitor.ua,
        location: await this.queryIPLocation(visitor.ip),
        link: getPermalinkByID(GUESTBOOK_POST_ID),
      })
    })

    return likes
  }

  // 1 minute > limit 15
  @Throttle(15, 60)
  @Post('/article')
  @Responser.handle('Vote article')
  async voteArticle(
    @Body() voteBody: PageVoteDTO,
    @DisqusToken() token: AccessToken | null,
    @QueryParams() { visitor }: QueryParamsResult
  ) {
    // NodePress
    const likes = await this.articleService.incrementLikes(voteBody.article_id)
    // Disqus
    this.voteDisqusThread(voteBody.article_id, voteBody.vote, token?.access_token).catch(() => {})
    // email to admin
    this.getAuthor({ guestAuthor: voteBody.author, disqusToken: token?.access_token }).then(async (author) => {
      this.emailToTargetVoteMessage({
        to: APP_CONFIG.APP.ADMIN_EMAIL,
        subject: `You have a new article vote`,
        on: await this.getTargetTitle(voteBody.article_id),
        vote: '+1',
        author,
        userAgent: visitor.ua,
        location: await this.queryIPLocation(visitor.ip),
        link: getPermalinkByID(voteBody.article_id),
      })
    })

    return likes
  }

  // 30 seconds > limit 10
  @Throttle(10, 30)
  @Post('/comment')
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
        const postID = await this.disqusPublicService.getDisqusPostIDByCommentID(voteBody.comment_id)
        if (postID) {
          await this.disqusPublicService.votePost({
            access_token: token.access_token,
            post: postID,
            vote: voteBody.vote,
          })
          // console.info(`Disqus like post ${voteBody.comment_id}`, result)
        }
      } catch (error) {}
    }

    // email to user and admin
    this.getAuthor({ guestAuthor: voteBody.author, disqusToken: token?.access_token }).then((author) => {
      this.commentService.getDetailByNumberID(voteBody.comment_id).then(async (comment) => {
        const targetTitle = await this.getTargetTitle(comment.post_id)
        const mailPayload = {
          vote: voteBody.vote > 0 ? '+1' : '-1',
          on: `${targetTitle} #${comment.id}`,
          author,
          userAgent: visitor.ua,
          location: await this.queryIPLocation(visitor.ip),
          link: getPermalinkByID(comment.post_id),
        }
        // email to admin
        this.emailToTargetVoteMessage({
          to: APP_CONFIG.APP.ADMIN_EMAIL,
          subject: `You have a new comment vote`,
          ...mailPayload,
        })
        // email to author
        if (comment.author.email) {
          this.emailToTargetVoteMessage({
            to: comment.author.email,
            subject: `Your comment #${comment.id} has a new vote`,
            ...mailPayload,
          })
        }
      })
    })

    return result
  }
}
