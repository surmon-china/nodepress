/**
 * @file Vote controller
 * @module module/vote/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import { IsInt, IsDefined, IsIn } from 'class-validator'
import { Controller, Post, Body } from '@nestjs/common'
import { HttpProcessor } from '@app/decorators/http.decorator'
import { OptionService } from '@app/modules/option/option.service'
import { ArticleService } from '@app/modules/article/article.service'
import { CommentService } from '@app/modules/comment/comment.service'
import { DisqusPublicService } from '@app/modules/disqus/disqus.service.public'
import { CookieToken } from '@app/modules/disqus/disqus.token'
import { AccessToken } from '@app/utils/disqus'
import { CommentPostID } from '@app/interfaces/biz.interface'

export class CommentVotePayload {
  @IsDefined()
  @IsInt()
  comment_id: number

  @IsDefined()
  @IsInt()
  @IsIn([1, -1])
  vote: number
}

export class ArticleVotePayload {
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
    private readonly disqusPublicService: DisqusPublicService,
    private readonly commentService: CommentService,
    private readonly articleService: ArticleService,
    private readonly optionService: OptionService
  ) {}

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
  async likeSite(@CookieToken() token: AccessToken | null) {
    const likes = await this.optionService.likeSite()
    this.voteDisqusThread(CommentPostID.Guestbook, 1, token?.access_token).catch(() => {})
    return likes
  }

  @Post('/article')
  @HttpProcessor.handle('Vote article')
  async voteArticle(@Body() voteBody: ArticleVotePayload, @CookieToken() token: AccessToken | null) {
    const likes = await this.articleService.like(voteBody.article_id)
    this.voteDisqusThread(voteBody.article_id, voteBody.vote, token?.access_token).catch(() => {})
    return likes
  }

  @Post('/comment')
  @HttpProcessor.handle('Vote comment')
  async voteComment(@Body() voteBody: CommentVotePayload, @CookieToken() token: AccessToken | null) {
    const result = await this.commentService.vote(voteBody.comment_id, voteBody.vote > 0)
    // only Disqus logined user
    if (token) {
      try {
        const postID = await this.disqusPublicService.getDisqusPostIDByCommentID(voteBody.comment_id)
        if (postID) {
          const result = await this.disqusPublicService.votePost({
            access_token: token.access_token,
            post: postID,
            vote: voteBody.vote,
          })
          // logger.info('[disqus]', `like post ${commentID}`, result)
        }
      } catch (error) {}
    }
    return result
  }
}
