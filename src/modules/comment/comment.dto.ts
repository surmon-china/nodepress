/**
 * @file Comment DTO
 * @module module/comment/dto
 * @author Surmon <https://github.com/surmon-china>
 */

import { Transform } from 'class-transformer'
import { ArrayNotEmpty, ArrayUnique } from 'class-validator'
import { IsString, IsArray, IsInt, IsEnum, IsOptional, IsDefined, Min } from 'class-validator'
import { IntersectionType, PartialType, PickType } from '@nestjs/mapped-types'
import { WithGuestPermission } from '@app/decorators/guest-permission.decorator'
import { KeywordQueryDto } from '@app/dtos/querys.dto'
import { PaginateOptionWithHotSortDto } from '@app/dtos/paginate.dto'
import { unknownToNumber } from '@app/transformers/value.transformer'
import { CommentStatus, CommentTargetType, CommentAuthorType } from './comment.constant'
import { Comment } from './comment.model'

export class CreateCommentDto extends PickType(Comment, [
  'target_type',
  'target_id',
  'parent_id',
  'content',
  'author_name',
  'author_email',
  'author_website'
] as const) {}

export class UpdateCommentDto extends IntersectionType(
  PartialType(CreateCommentDto),
  PartialType(PickType(Comment, ['status', 'likes', 'dislikes', 'ip', 'user_agent', 'extras'] as const))
) {}

export class CommentPaginateQueryDto extends IntersectionType(PaginateOptionWithHotSortDto, KeywordQueryDto) {
  @WithGuestPermission({ only: [CommentStatus.Approved], default: CommentStatus.Approved })
  @IsEnum(CommentStatus)
  @IsOptional()
  @Transform(({ value }) => unknownToNumber(value))
  status?: CommentStatus

  @IsEnum(CommentTargetType)
  @IsOptional()
  target_type?: CommentTargetType

  @Min(0)
  @IsInt()
  @IsOptional()
  @Transform(({ value }) => unknownToNumber(value))
  target_id?: number

  @IsEnum(CommentAuthorType)
  @IsOptional()
  author_type?: CommentAuthorType
}

export class CommentCalendarQueryDto {
  @IsString()
  @IsOptional()
  timezone?: string
}

export class CommentIdsDto {
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsArray()
  @IsInt({ each: true })
  comment_ids: number[]
}

export class CommentIdsStatusDto extends CommentIdsDto {
  @IsEnum(CommentStatus)
  @IsDefined()
  status: CommentStatus
}

export class ClaimCommentsDto extends CommentIdsDto {
  @IsInt()
  @IsDefined()
  user_id: number
}
