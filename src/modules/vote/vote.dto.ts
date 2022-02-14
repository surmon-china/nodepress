/**
 * @file Vote DTO
 * @module module/vote/dto
 * @author Surmon <https://github.com/surmon-china>
 */

import { IsInt, IsDefined, IsIn, IsOptional, IsObject, ValidateNested } from 'class-validator'
import { Author } from '@app/modules/comment/comment.model'

export class VoteAuthorDTO {
  @ValidateNested()
  @IsObject()
  @IsOptional()
  author?: Author
}

export class CommentVoteDTO extends VoteAuthorDTO {
  @IsDefined()
  @IsInt()
  comment_id: number

  @IsDefined()
  @IsInt()
  @IsIn([1, -1])
  vote: number
}

export class PageVoteDTO extends VoteAuthorDTO {
  @IsDefined()
  @IsInt()
  article_id: number

  @IsDefined()
  @IsInt()
  @IsIn([1])
  vote: number
}
