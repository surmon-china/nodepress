/**
 * @file Comment DTO
 * @module module/comment/dto
 * @author Surmon <https://github.com/surmon-china>
 */

import { IntersectionType } from '@nestjs/mapped-types'
import { IsString, IsArray, IsIn, IsInt, Min } from 'class-validator'
import { IsNotEmpty, IsOptional, ArrayNotEmpty, ArrayUnique } from 'class-validator'
import { Transform } from 'class-transformer'
import { WithGuestPermission } from '@app/decorators/guest-permission.decorator'
import { CommentState } from '@app/constants/biz.constant'
import { COMMENT_STATES } from './comment.model'
import { KeywordQueryDTO } from '@app/models/query.model'
import { PaginateOptionWithHotSortDTO } from '@app/models/paginate.model'
import { unknownToNumber } from '@app/transformers/value.transformer'

export class CommentPaginateQueryDTO extends IntersectionType(PaginateOptionWithHotSortDTO, KeywordQueryDTO) {
  @WithGuestPermission({ only: [CommentState.Published], default: CommentState.Published })
  @IsIn(COMMENT_STATES)
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => unknownToNumber(value))
  state?: CommentState

  @Min(0)
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => unknownToNumber(value))
  post_id?: number
}

export class CommentCalendarQueryDTO {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  timezone?: string
}

export class CommentsDTO {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  comment_ids: string[]

  @IsArray()
  @ArrayUnique()
  post_ids: number[]
}

export class CommentsStateDTO extends CommentsDTO {
  @IsIn(COMMENT_STATES)
  @IsInt()
  state: CommentState
}
