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
import { KeywordQueryDTO } from '@app/models/query.model'
import { PaginateOptionWithHotSortDTO } from '@app/models/paginate.model'
import { unknownToNumber } from '@app/transformers/value.transformer'
import { CommentStatus, COMMENT_STATUSES } from './comment.constant'

export class CommentPaginateQueryDTO extends IntersectionType(PaginateOptionWithHotSortDTO, KeywordQueryDTO) {
  @WithGuestPermission({ only: [CommentStatus.Published], default: CommentStatus.Published })
  @IsIn(COMMENT_STATUSES)
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => unknownToNumber(value))
  status?: CommentStatus

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

export class CommentsStatusDTO extends CommentsDTO {
  @IsIn(COMMENT_STATUSES)
  @IsInt()
  status: CommentStatus
}
