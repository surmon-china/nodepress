/**
 * @file Disqus DTO
 * @module module/disqus/dto
 * @author Surmon <https://github.com/surmon-china>
 */

import { IsString, IsNumberString, IsNotEmpty, IsNumber } from 'class-validator'

export interface GeneralDisqusParams {
  [key: string]: any
}

export enum ThreadState {
  Open = 'open',
  Closed = 'closed'
}

export class CallbackCodeDTO {
  @IsNotEmpty()
  @IsString()
  code: string
}

export class ThreadPostIdDTO {
  @IsNotEmpty()
  @IsNumberString()
  post_id: string
}

export class CommentIdDTO {
  @IsNotEmpty()
  @IsNumber()
  comment_id: number
}
