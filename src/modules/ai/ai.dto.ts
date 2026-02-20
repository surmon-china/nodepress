/**
 * @file AI DTO
 * @module module/ai/dto
 * @author Surmon <https://github.com/surmon-china>
 */

import { IsString, IsNumber, IsEnum, IsDefined, IsOptional, Min } from 'class-validator'
import { AiModelIds } from './ai.config'

export class GenerateAiContentDto {
  @IsString()
  @IsOptional()
  prompt?: string

  @IsEnum(AiModelIds)
  @IsOptional()
  model?: AiModelIds

  @Min(0)
  @IsNumber()
  @IsOptional()
  temperature?: number
}

export class GenerateAiArticleContentDto extends GenerateAiContentDto {
  @IsNumber()
  @IsDefined()
  article_id: number
}

export class GenerateAiCommentReplyDto extends GenerateAiContentDto {
  @IsNumber()
  @IsDefined()
  comment_id: number
}
