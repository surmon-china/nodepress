/**
 * @file Vote controller
 * @module module/vote/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import { IsInt, IsDefined, IsIn, IsOptional, IsObject, ValidateNested } from 'class-validator'
import { Controller, Post, Body } from '@nestjs/common'
import { QueryParams } from '@app/decorators/query-params.decorator'
import { HttpProcessor } from '@app/decorators/http.decorator'
import { IPService, IPLocation } from '@app/processors/helper/helper.service.ip'
import { EmailService } from '@app/processors/helper/helper.service.email'
import { OptionService } from '@app/modules/option/option.service'
import { ArticleService } from '@app/modules/article/article.service'
import { CommentService } from '@app/modules/comment/comment.service'
import { Author } from '@app/modules/comment/comment.model'
import { DisqusPublicService } from '@app/modules/disqus/disqus.service.public'
import { CookieToken } from '@app/modules/disqus/disqus.token'
import { AccessToken } from '@app/utils/disqus'
import { CommentPostID } from '@app/interfaces/biz.interface'
import { getPermalinkByID } from '@app/transformers/urlmap.transformer'
import * as APP_CONFIG from '@app/app.config'

export class VoteAuthorPayload {
  @ValidateNested()
  @IsObject()
  @IsOptional()
  author?: Author
}

export class CommentVotePayload extends VoteAuthorPayload {
  @IsDefined()
  @IsInt()
  comment_id: number

  @IsDefined()
  @IsInt()
  @IsIn([1, -1])
  vote: number
}

export class PageVotePayload extends VoteAuthorPayload {
  @IsDefined()
  @IsInt()
  article_id: number

  @IsDefined()
  @IsInt()
  @IsIn([1])
  vote: number
}

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

  private async getAuthor(author: Author | void, token?: string | null) {
    // disqus user
    if (token) {
      try {
        const userInfo = await this.disqusPublicService.getUserInfo(token)
        return `(Disqus user) ${userInfo.name}` + [userInfo.url, userInfo.profileUrl].filter(Boolean).join(' - ')
      } catch (error) {}
    }
    // local user
    if (author) {
      return `(Guest user) ${author.name}`
    }
    // guest user
    return `Anonymous user`
  }

  private async getTargetTitle(post_id: number) {
    if (post_id === CommentPostID.Guestbook) {
      return 'guestbook'
    } else {
      const article = await this.articleService.getDetailByNumberIDOrSlug(post_id)
      return article.toObject().title
    }
  }

  // Email to admin
  // 1. site vote
  // 2. article vote
  // 3. comment vote
  private emailToTargetVoteMessage(message: {
    type: string
    to: string
    on: string
    link: string
    vote: string
    author: string
    location?: IPLocation | null
  }) {
    const mailTexts = [
      `You have a new ${message.type} vote on "${message.on}".`,
      `Vote: ${message.vote}`,
      `Author: ${message.author}`,
      `Location: ${
        message.location
          ? [message.location.country, message.location.region, message.location.city].join(' · ')
          : 'unknow'
      }`,
    ]

    this.emailService.sendMail({
      to: message.to,
      subject: `[${APP_CONFIG.APP.FE_NAME}] You have a new ${message.type} vote`,
      text: mailTexts.join('\n'),
      html: [
        mailTexts.map((t) => `<p>${t}</p>`).join(''),
        `<br>`,
        `<a href="${message.link}" target="_blank">${message.on}</a>`,
      ].join('\n'),
    })
  }

  // Disqus logined user or guest user
  async voteDisqusThread(articleID: number, vote: number, token?: string) {
    const thread = await this.disqusPublicService.makeSureThreadDetail(articleID)
    const result = await this.disqusPublicService.voteThread({
      access_token: token || null,
      thread: thread.id,
      vote,
    })
    // logger.info('[disqus]', `like thread ${articleID}`, result)
    return result
  }

  @Post('/site')
  @HttpProcessor.handle('Vote site')
  async likeSite(
    @Body() voteBody: VoteAuthorPayload,
    @CookieToken() token: AccessToken | null,
    @QueryParams() { visitor }
  ) {
    // NodePress
    const likes = await this.optionService.likeSite()
    // Disqus
    this.voteDisqusThread(CommentPostID.Guestbook, 1, token?.access_token).catch(() => {})
    // email to admin
    this.emailToTargetVoteMessage({
      type: 'site',
      vote: '+1',
      to: APP_CONFIG.EMAIL.admin,
      on: await this.getTargetTitle(CommentPostID.Guestbook),
      author: await this.getAuthor(voteBody.author, token?.access_token),
      location: await this.ipService.queryLocation(visitor.ip),
      link: getPermalinkByID(CommentPostID.Guestbook),
    })

    return likes
  }

  @Post('/article')
  @HttpProcessor.handle('Vote article')
  async voteArticle(
    @Body() voteBody: PageVotePayload,
    @CookieToken() token: AccessToken | null,
    @QueryParams() { visitor }
  ) {
    // NodePress
    const likes = await this.articleService.like(voteBody.article_id)
    // Disqus
    this.voteDisqusThread(voteBody.article_id, voteBody.vote, token?.access_token).catch(() => {})
    // email to admin
    this.emailToTargetVoteMessage({
      type: 'article',
      vote: '+1',
      to: APP_CONFIG.EMAIL.admin,
      on: await this.getTargetTitle(voteBody.article_id),
      author: await this.getAuthor(voteBody.author, token?.access_token),
      location: await this.ipService.queryLocation(visitor.ip),
      link: getPermalinkByID(voteBody.article_id),
    })

    return likes
  }

  @Post('/comment')
  @HttpProcessor.handle('Vote comment')
  async voteComment(
    @Body() voteBody: CommentVotePayload,
    @CookieToken() token: AccessToken | null,
    @QueryParams() { visitor }
  ) {
    // NodePress
    const result = await this.commentService.vote(voteBody.comment_id, voteBody.vote > 0)
    // Disqus only logined user
    if (token) {
      try {
        const postID = await this.disqusPublicService.getDisqusPostIDByCommentID(voteBody.comment_id)
        if (postID) {
          const result = await this.disqusPublicService.votePost({
            access_token: token.access_token,
            post: postID,
            vote: voteBody.vote,
          })
          // logger.info('[disqus]', `like post ${voteBody.comment_id}`, result)
        }
      } catch (error) {}
    }
    // email to author
    const comment = await this.commentService.getDetailByNumberID(voteBody.comment_id)
    if (comment.author.email) {
      const tagetTitle = await this.getTargetTitle(comment.post_id)
      this.emailToTargetVoteMessage({
        type: 'comment',
        to: comment.author.email,
        vote: voteBody.vote > 0 ? '+1' : '-1',
        on: `${tagetTitle} #${comment.id}`,
        author: await this.getAuthor(voteBody.author, token?.access_token),
        location: await this.ipService.queryLocation(visitor.ip),
        link: getPermalinkByID(comment.post_id),
      })
    }

    return result
  }
}
