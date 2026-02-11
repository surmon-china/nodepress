/**
 * @file AI DTO
 * @module module/ai/dto
 * @author Surmon <https://github.com/surmon-china>
 */

import { IsString, IsNumber, IsEnum, IsNotEmpty, IsOptional, Min } from 'class-validator'
import { AiModelIds } from './ai.config'

export class GenerateAiContentDTO {
  @IsString()
  @IsOptional()
  prompt?: string

  @IsOptional()
  @IsEnum(AiModelIds)
  model?: AiModelIds

  @Min(0)
  @IsNumber()
  @IsOptional()
  temperature?: number
}

export class GenerateAiArticleContentDTO extends GenerateAiContentDTO {
  @IsNumber()
  @IsNotEmpty()
  article_id: number
}

export class GenerateAiCommentReplyDTO extends GenerateAiContentDTO {
  @IsNumber()
  @IsNotEmpty()
  comment_id: number
}
