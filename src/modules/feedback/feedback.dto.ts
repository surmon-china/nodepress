/**
 * @file Feedback DTO
 * @module module/feedback/dto
 * @author Surmon <https://github.com/surmon-china>
 */

import { Transform } from 'class-transformer'
import { IsString, IsBoolean, IsEnum, IsInt, IsArray, IsDefined } from 'class-validator'
import { IsOptional, IsNotEmpty, MinLength, MaxLength, ArrayNotEmpty, ArrayUnique } from 'class-validator'
import { PartialType, IntersectionType } from '@nestjs/mapped-types'
import { unknownToNumber, unknownToBoolean } from '@app/transformers/value.transformer'
import { KeywordQueryDto } from '@app/dtos/querys.dto'
import { OptionalAuthorDto } from '@app/dtos/author.dto'
import { PaginateOptionDto } from '@app/dtos/paginate.dto'
import { FeedbackEmotion } from './feedback.constant'

export class CreateFeedbackDto extends OptionalAuthorDto {
  @IsEnum(FeedbackEmotion)
  @IsDefined()
  emotion: FeedbackEmotion

  @MinLength(3)
  @MaxLength(3000)
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  content: string
}

export class UpdateFeedbackDto extends PartialType(CreateFeedbackDto) {
  @IsBoolean()
  @IsOptional()
  marked?: boolean

  @MaxLength(1000)
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  remark?: string
}

export class FeedbackPaginateQueryDto extends IntersectionType(PaginateOptionDto, KeywordQueryDto) {
  @IsEnum(FeedbackEmotion)
  @IsOptional()
  @Transform(({ value }) => unknownToNumber(value))
  emotion?: number

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => unknownToBoolean(value))
  marked?: boolean
}

export class FeedbackIdsDto {
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsArray()
  @IsInt({ each: true })
  feedback_ids: number[]
}
