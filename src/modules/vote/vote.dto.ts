/**
 * @file Vote DTO
 * @module module/vote/dto
 * @author Surmon <https://github.com/surmon-china>
 */

import { Transform, Type } from 'class-transformer'
import { IsInt, IsObject, IsArray, IsDefined, IsOptional, IsNotEmpty } from 'class-validator'
import { IsIn, ValidateNested, ArrayNotEmpty, ArrayUnique } from 'class-validator'
import { PaginateOptionDTO } from '@app/models/paginate.model'
import { Author } from '@app/modules/comment/comment.model'
import { unknownToNumber } from '@app/transformers/value.transformer'
import { VoteType, VOTE_TYPES, VOTE_TARGETS, VOTE_AUTHOR_TYPES } from './vote.constant'

export class VotePaginateQueryDTO extends PaginateOptionDTO {
  @IsIn(VOTE_TARGETS)
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => unknownToNumber(value))
  target_type?: number

  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => unknownToNumber(value))
  target_id?: number

  @IsIn(VOTE_TYPES)
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => unknownToNumber(value))
  vote_type?: number

  @IsIn(VOTE_AUTHOR_TYPES)
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => unknownToNumber(value))
  author_type?: number
}

export class VotesDTO {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  vote_ids: string[]
}

export class VoteAuthorDTO {
  @Type(() => Author)
  @ValidateNested()
  @IsObject()
  @IsOptional()
  author?: Author
}

export class CommentVoteDTO extends VoteAuthorDTO {
  @IsInt()
  @IsDefined()
  comment_id: number

  @IsIn(VOTE_TYPES)
  @IsInt()
  @IsDefined()
  vote: number
}

export class ArticleVoteDTO extends VoteAuthorDTO {
  @IsInt()
  @IsDefined()
  article_id: number

  @IsIn([VoteType.Upvote])
  @IsInt()
  @IsDefined()
  vote: number
}
