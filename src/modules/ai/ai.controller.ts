/**
 * @file AI controller
 * @module module/ai/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import { Throttle, minutes } from '@nestjs/throttler'
import { Controller, Get, Post, Body } from '@nestjs/common'
import { OnlyIdentity, IdentityRole } from '@app/decorators/only-identity.decorator'
import { SuccessResponse } from '@app/decorators/success-response.decorator'
import { CommentService } from '@app/modules/comment/comment.service'
import { GenerateAiArticleContentDto, GenerateAiCommentReplyDto } from './ai.dto'
import { AiModelsList, DEFAULT_AI_PROMPT_TEMPLATES } from './ai.config'
import { AiGenerateResult } from './ai.interface'
import { AiService } from './ai.service'

import {
  ArticleAiSummaryExtraKeys,
  ArticleAiReviewExtraKeys,
  CommentAiGenerationExtraKeys
} from '@app/constants/extras.constant'

@Controller('ai')
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private readonly commentService: CommentService
  ) {}

  @Get('config')
  @OnlyIdentity(IdentityRole.Admin)
  @SuccessResponse('Get AI config succeeded')
  getAiConfig() {
    return {
      models: AiModelsList,
      prompts: DEFAULT_AI_PROMPT_TEMPLATES,
      extra_keys: {
        article_summary: ArticleAiSummaryExtraKeys,
        article_review: ArticleAiReviewExtraKeys,
        comment_generation: CommentAiGenerationExtraKeys
      }
    }
  }

  @Post('generate-article-summary')
  @OnlyIdentity(IdentityRole.Admin)
  @Throttle({ default: { ttl: minutes(10), limit: 50 } })
  @SuccessResponse('Generate article summary succeeded')
  generateArticleSummary(@Body() dto: GenerateAiArticleContentDto): Promise<AiGenerateResult> {
    return this.aiService.generateArticleSummary(dto)
  }

  @Post('generate-article-review')
  @OnlyIdentity(IdentityRole.Admin)
  @Throttle({ default: { ttl: minutes(10), limit: 50 } })
  @SuccessResponse('Generate article review succeeded')
  generateArticleReview(@Body() dto: GenerateAiArticleContentDto): Promise<AiGenerateResult> {
    return this.aiService.generateArticleReview(dto)
  }

  @Post('generate-comment-reply')
  @OnlyIdentity(IdentityRole.Admin)
  @Throttle({ default: { ttl: minutes(10), limit: 50 } })
  @SuccessResponse('Generate comment reply succeeded')
  async generateCommentReply(@Body() dto: GenerateAiCommentReplyDto): Promise<AiGenerateResult> {
    const comment = await this.commentService.getDetail(dto.comment_id)
    return this.aiService.generateCommentReply(comment, dto)
  }
}
