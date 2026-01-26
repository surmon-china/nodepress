/**
 * @file Feedback DTO
 * @module module/feedback/dto
 * @author Surmon <https://github.com/surmon-china>
 */

import { IntersectionType } from '@nestjs/mapped-types'
import { Transform } from 'class-transformer'
import { IsNotEmpty, IsArray, IsIn, IsInt, IsOptional, Min, ArrayNotEmpty, ArrayUnique } from 'class-validator'
import { KeywordQueryDTO, BooleanNumberValue } from '@app/models/query.model'
import { PaginateOptionDTO } from '@app/models/paginate.model'
import { unknownToNumber } from '@app/transformers/value.transformer'
import { FEEDBACK_EMOTION_VALUES } from './feedback.constant'

export class FeedbackPaginateQueryDTO extends IntersectionType(PaginateOptionDTO, KeywordQueryDTO) {
  @Min(0)
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => unknownToNumber(value))
  tid?: number

  @IsIn(FEEDBACK_EMOTION_VALUES)
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => unknownToNumber(value))
  emotion?: number

  @IsIn([BooleanNumberValue.False, BooleanNumberValue.True])
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => unknownToNumber(value))
  marked?: BooleanNumberValue.True | BooleanNumberValue.False
}

export class FeedbacksDTO {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  feedback_ids: string[]
}
