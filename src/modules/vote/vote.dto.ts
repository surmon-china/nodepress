/**
 * @file Vote DTO
 * @module module/vote/dto
 * @author Surmon <https://github.com/surmon-china>
 */

import { Transform } from 'class-transformer'
import { IsInt, IsArray, IsIn, IsEnum, IsDefined, IsOptional, ArrayNotEmpty, ArrayUnique } from 'class-validator'
import { PaginateOptionDto } from '@app/dtos/paginate.dto'
import { OptionalAuthorDto } from '@app/dtos/author.dto'
import { unknownToNumber } from '@app/transformers/value.transformer'
import { VoteTargetType, VoteType, VoteAuthorType } from './vote.constant'

export class CommentVoteDto extends OptionalAuthorDto {
  @IsInt()
  @IsDefined()
  comment_id: number

  @IsEnum(VoteType)
  @IsDefined()
  vote: VoteType
}

export class ArticleVoteDto extends OptionalAuthorDto {
  @IsInt()
  @IsDefined()
  article_id: number

  @IsIn([VoteType.Upvote])
  @IsInt()
  @IsDefined()
  vote: VoteType.Upvote
}

export class VotePaginateQueryDto extends PaginateOptionDto {
  @IsEnum(VoteTargetType)
  @IsOptional()
  target_type?: VoteTargetType

  @IsInt()
  @IsOptional()
  @Transform(({ value }) => unknownToNumber(value))
  target_id?: number

  @IsEnum(VoteType)
  @IsOptional()
  @Transform(({ value }) => unknownToNumber(value))
  vote_type?: VoteType

  @IsEnum(VoteAuthorType)
  @IsOptional()
  author_type?: VoteAuthorType
}

export class VoteIdsDto {
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsArray()
  @IsInt({ each: true })
  vote_ids: number[]
}
