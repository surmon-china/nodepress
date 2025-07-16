/**
 * @file Comment model
 * @module module/comment/model
 * @author Surmon <https://github.com/surmon-china>
 */

import { AutoIncrementID } from '@typegoose/auto-increment'
import { prop, plugin, modelOptions, Severity } from '@typegoose/typegoose'
import { Type } from 'class-transformer'
import { IsString, IsIn, IsIP, IsUrl, IsEmail, IsInt, IsArray, IsObject, ArrayUnique } from 'class-validator'
import { IsDefined, IsOptional, IsNotEmpty, ValidateNested, MinLength, MaxLength } from 'class-validator'
import { GENERAL_DB_AUTO_INCREMENT_ID_CONFIG } from '@app/constants/database.constant'
import { mongoosePaginate } from '@app/utils/paginate'
import { getProviderByTypegooseClass } from '@app/transformers/model.transformer'
import { ROOT_COMMENT_PID, CommentState } from '@app/constants/biz.constant'
import { IPLocation } from '@app/core/helper/helper.service.ip'
import { KeyValueModel } from '@app/models/key-value.model'
import { decodeMD5 } from '@app/transformers/codec.transformer'

export const COMMENT_STATES = [
  CommentState.Auditing,
  CommentState.Published,
  CommentState.Deleted,
  CommentState.Spam
] as const

export const COMMENT_GUEST_QUERY_FILTER = Object.freeze({
  state: CommentState.Published
})

@modelOptions({
  schemaOptions: {
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
})
export class Author {
  @MaxLength(20)
  @IsString()
  @IsNotEmpty()
  @prop({ required: true, validate: /\S+/ })
  name: string

  // MARK: can't get Disqus user's email
  @IsEmail()
  @IsString()
  @IsOptional()
  @prop({ type: String, default: null })
  email?: string | null

  @IsUrl({ require_protocol: true })
  @IsString()
  @IsOptional()
  @prop({ type: String, default: null })
  site?: string | null

  public get email_hash() {
    const email = this.email?.trim().toLowerCase()
    return email ? decodeMD5(email) : null
  }
}

export class CommentBase {
  @IsInt()
  @IsNotEmpty({ message: 'post ID?' })
  @prop({ required: true, index: true })
  post_id: number

  // parent comment ID
  @IsInt()
  @prop({ default: ROOT_COMMENT_PID, index: true })
  pid: number

  @MinLength(3) // sync with Disqus
  @MaxLength(3000)
  @IsString()
  @IsNotEmpty({ message: 'comment content?' })
  @prop({ required: true, validate: /\S+/ })
  content: string

  // user agent
  @IsString()
  @prop({ type: String, default: null })
  agent?: string | null

  @Type(() => Author)
  @ValidateNested()
  @IsObject()
  @IsNotEmpty()
  @IsDefined({ message: 'comment author?' })
  @prop({ required: true, _id: false })
  author: Author
}

@plugin(mongoosePaginate)
@plugin(AutoIncrementID, GENERAL_DB_AUTO_INCREMENT_ID_CONFIG)
@modelOptions({
  // https://typegoose.github.io/typegoose/docs/api/decorators/model-options/#allowmixed
  options: { allowMixed: Severity.ALLOW },
  schemaOptions: {
    versionKey: false,
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
})
export class Comment extends CommentBase {
  @prop({ unique: true })
  id?: number

  // state
  @IsIn(COMMENT_STATES)
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
  @prop({ type: String, default: null })
  ip: string | null

  // IP location
  @prop({ type: Object, default: null })
  ip_location: Partial<IPLocation> | null

  @prop({ default: Date.now, immutable: true })
  created_at?: Date

  @prop({ default: Date.now })
  updated_at?: Date

  @ArrayUnique()
  @IsArray()
  @prop({ _id: false, default: [], type: () => [KeyValueModel] })
  extends: KeyValueModel[]
}

export const CommentProvider = getProviderByTypegooseClass(Comment)
