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
  @IsInt()
  @IsDefined()
  comment_id: number

  @IsIn([1, -1])
  @IsInt()
  @IsDefined()
  vote: number
}

export class PageVoteDTO extends VoteAuthorDTO {
  @IsInt()
  @IsDefined()
  article_id: number

  @IsIn([1])
  @IsInt()
  @IsDefined()
  vote: number
}
