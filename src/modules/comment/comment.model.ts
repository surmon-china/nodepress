/**
 * @file Comment model
 * @module module/comment/model
 * @author Surmon <https://github.com/surmon-china>
 */

import { Types } from 'mongoose'
import { AutoIncrementID } from '@typegoose/auto-increment'
import { prop, plugin, modelOptions, Severity } from '@typegoose/typegoose'
import { Type } from 'class-transformer'
import {
  IsString,
  MinLength,
  MaxLength,
  IsDefined,
  IsIn,
  IsIP,
  IsUrl,
  IsEmail,
  IsInt,
  IsOptional,
  IsNotEmpty,
  IsArray,
  IsObject,
  ValidateNested,
  ArrayNotEmpty,
  ArrayUnique,
} from 'class-validator'
import { generalAutoIncrementIDConfig } from '@app/constants/increment.constant'
import { mongoosePaginate } from '@app/utils/paginate'
import { getProviderByTypegooseClass } from '@app/transformers/model.transformer'
import { decodeMD5 } from '@app/transformers/codec.transformer'
import { CommentParentID, CommentState } from '@app/interfaces/biz.interface'
import { IPLocation } from '@app/processors/helper/helper.service.ip'
import { Extend } from '@app/models/extend.model'

@modelOptions({
  schemaOptions: {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
})
export class Author {
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @prop({ required: true, validate: /\S+/ })
  name: string

  // can't get disqus user's email
  @IsString()
  @IsEmail()
  @IsOptional()
  @prop()
  email?: string

  @IsUrl({ require_protocol: true })
  @IsString()
  @IsOptional()
  @prop()
  site?: string

  public get email_hash() {
    const email = this.email?.trim().toLowerCase()
    return email ? decodeMD5(email) : null
  }
}

// 创建评论的基数据
export class CreateCommentBase {
  // article ID
  @IsNotEmpty({ message: 'post id?' })
  @IsInt()
  @prop({ required: true, index: true })
  post_id: number

  // parent comment ID
  @IsInt()
  @prop({ default: CommentParentID.Self, index: true })
  pid: number

  @IsNotEmpty({ message: 'comment content?' })
  @IsString({ message: 'comment content must be string type' })
  @MaxLength(3000)
  @MinLength(3) // sync with Disqus
  @prop({ required: true, validate: /\S+/ })
  content: string

  // user agent
  @prop({ validate: /\S+/ })
  agent?: string

  @Type(() => Author)
  @ValidateNested()
  @IsObject()
  @IsNotEmpty()
  @IsDefined({ message: 'comment author?' })
  @prop({ required: true, _id: false })
  author: Author
}

@plugin(mongoosePaginate)
@plugin(AutoIncrementID, generalAutoIncrementIDConfig)
@modelOptions({
  // https://typegoose.github.io/typegoose/docs/api/decorators/model-options/#allowmixed
  options: { allowMixed: Severity.ALLOW },
  schemaOptions: {
    timestamps: {
      createdAt: 'create_at',
      updatedAt: 'update_at',
    },
  },
})
export class Comment extends CreateCommentBase {
  @prop({ unique: true })
  id?: number

  // comment state
  @IsIn([CommentState.Auditing, CommentState.Deleted, CommentState.Published, CommentState.Spam])
  @IsInt()
  @prop({ enum: CommentState, default: CommentState.Published, index: true })
  state: CommentState

  // likes
  @IsInt()
  @prop({ default: 0, index: true })
  likes: number

  @IsInt()
  @prop({ default: 0, index: true })
  dislikes: number

  // IP address
  @IsIP()
  @IsOptional()
  @prop()
  ip?: string

  // IP location
  @prop({ default: null, type: Object })
  ip_location: null | (Partial<IPLocation> & { [key: string]: any })

  @prop({ default: Date.now, immutable: true })
  create_at?: Date

  @prop({ default: Date.now })
  update_at?: Date

  @IsArray()
  @ArrayUnique()
  @prop({ _id: false, default: [], type: () => [Extend] })
  extends: Extend[]
}

export class CommentsPayload {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  comment_ids: Types.ObjectId[]

  @IsArray()
  @ArrayUnique()
  post_ids: number[]
}

export class CommentsStatePayload extends CommentsPayload {
  @IsIn([CommentState.Auditing, CommentState.Deleted, CommentState.Published, CommentState.Spam])
  @IsInt()
  @prop({ enum: CommentState, default: CommentState.Published })
  state: CommentState
}

export const CommentProvider = getProviderByTypegooseClass(Comment)
