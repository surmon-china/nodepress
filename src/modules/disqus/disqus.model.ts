/**
 * @file Disqus model
 * @module module/disqus/model
 * @author Surmon <https://github.com/surmon-china>
 */

import { IsString, IsNumberString, IsNotEmpty, IsNumber } from 'class-validator'

export interface GeneralDisqusParams {
  [key: string]: any
}

export enum ThreadState {
  Open = 'open',
  Closed = 'closed',
}

export class CallbackCodePayload {
  @IsNotEmpty()
  @IsString()
  code: string
}

export class ThreadPostIDPayload {
  @IsNotEmpty()
  @IsNumberString()
  post_id: string
}

export class CommentIDPayload {
  @IsNotEmpty()
  @IsNumber()
  comment_id: number
}
