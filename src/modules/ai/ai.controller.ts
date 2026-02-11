/**
 * @file AI controller
 * @module module/ai/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import { Throttle, minutes } from '@nestjs/throttler'
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common'
import { AdminOnlyGuard } from '@app/guards/admin-only.guard'
import { SuccessResponse } from '@app/decorators/success-response.decorator'
import { CommentService } from '@app/modules/comment/comment.service'
import { GenerateAiArticleContentDTO, GenerateAiCommentReplyDTO } from './ai.dto'
import { AiModelsList, DEFAULT_AI_PROMPT_TEMPLATES } from './ai.config'
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
  @UseGuards(AdminOnlyGuard)
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
  @Throttle({ default: { ttl: minutes(10), limit: 50 } })
  @UseGuards(AdminOnlyGuard)
  @SuccessResponse('Generate article summary succeeded')
  generateArticleSummary(@Body() payload: GenerateAiArticleContentDTO) {
    return this.aiService.generateArticleSummary(payload)
  }

  @Post('generate-article-review')
  @Throttle({ default: { ttl: minutes(10), limit: 50 } })
  @UseGuards(AdminOnlyGuard)
  @SuccessResponse('Generate article review succeeded')
  generateArticleReview(@Body() payload: GenerateAiArticleContentDTO) {
    return this.aiService.generateArticleReview(payload)
  }

  @Post('generate-comment-reply')
  @Throttle({ default: { ttl: minutes(10), limit: 50 } })
  @UseGuards(AdminOnlyGuard)
  @SuccessResponse('Generate comment reply succeeded')
  async generateCommentReply(@Body() payload: GenerateAiCommentReplyDTO) {
    const comment = await this.commentService.getDetailByNumberId(payload.comment_id)
    return this.aiService.generateCommentReply(comment, payload)
  }
}
