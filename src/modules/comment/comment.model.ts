/**
 * @file Comment model
 * @module module/comment/model
 * @author Surmon <https://github.com/surmon-china>
 */

import type { MergeType } from 'mongoose'
import MongooseLeanVirtuals from 'mongoose-lean-virtuals'
import { AutoIncrementID } from '@typegoose/auto-increment'
import { prop, plugin, index, modelOptions, Severity, Ref } from '@typegoose/typegoose'
import { Transform, Type } from 'class-transformer'
import { ArrayUnique, ValidateNested } from 'class-validator'
import { IsNotEmpty, IsOptional, IsDefined, MinLength, MaxLength, Min } from 'class-validator'
import { IsString, IsArray, IsUrl, IsEmail, IsInt, IsEnum, IsIP } from 'class-validator'
import { GENERAL_DB_AUTO_INCREMENT_ID_CONFIG } from '@app/constants/database.constant'
import { User, UserPublic } from '@app/modules/user/user.model'
import { KeyValueModel } from '@app/models/key-value.model'
import { MongooseDoc } from '@app/interfaces/mongoose.interface'
import { IPLocation } from '@app/core/helper/helper.service.ip'
import { getProviderByTypegooseClass } from '@app/transformers/model.transformer'
import { hashMD5 } from '@app/transformers/codec.transformer'
import { mongoosePaginate } from '@app/utils/paginate'
import { CommentStatus, CommentTargetType, CommentAuthorType } from './comment.constant'

export type CommentDoc = MongooseDoc<Comment>
export type CommentWith<U extends User | UserPublic> = MergeType<Comment, { user: U | null }>
export type CommentDocWith<U extends User | UserPublic> = MergeType<CommentDoc, { user: U | null }>

export type NormalizedComment = Omit<
  Comment,
  'id' | 'created_at' | 'updated_at' | 'author_type' | 'author_email_hash'
>

@plugin(mongoosePaginate)
@plugin(MongooseLeanVirtuals)
@plugin(AutoIncrementID, GENERAL_DB_AUTO_INCREMENT_ID_CONFIG)
@index({ user: 1, created_at: -1 })
@index({ target_type: 1, target_id: 1, status: 1, created_at: -1 })
@modelOptions({
  // https://typegoose.github.io/typegoose/docs/api/decorators/model-options/#allowmixed
  options: { allowMixed: Severity.ALLOW },
  schemaOptions: {
    id: false,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
})
export class Comment {
  @prop({ unique: true })
  id: number

  @IsEnum(CommentStatus)
  @IsOptional()
  @prop({ type: Number, enum: CommentStatus, default: CommentStatus.Published, index: true })
  status: CommentStatus

  @IsEnum(CommentTargetType)
  @IsDefined()
  @prop({ type: String, enum: CommentTargetType, required: true, index: true })
  target_type: CommentTargetType

  @IsInt()
  @IsDefined()
  @prop({ type: Number, required: true, index: true })
  target_id: number

  @Min(0)
  @IsInt()
  @IsOptional()
  @prop({ type: Number, default: null, index: true })
  parent_id: number | null

  @MinLength(3)
  @MaxLength(3000)
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @prop({ type: String, required: true, trim: true, validate: /\S+/, maxlength: 3000 })
  content: string

  @prop({ ref: () => User, default: null, index: true })
  user: Ref<User> | null

  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @prop({ type: String, required: true, trim: true, validate: /\S+/, maxlength: 100 })
  author_name: string

  @IsEmail()
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @prop({ type: String, default: null, trim: true })
  author_email: string | null

  @MaxLength(500)
  @IsUrl({ require_protocol: true })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @prop({ type: String, default: null, trim: true, maxlength: 500 })
  author_website: string | null

  public get author_email_hash() {
    const email = this.author_email?.trim().toLowerCase()
    return email ? hashMD5(email) : null
  }

  public get author_type(): CommentAuthorType {
    return this.user ? CommentAuthorType.User : CommentAuthorType.Guest
  }

  @IsInt()
  @IsOptional()
  @prop({ type: Number, default: 0, min: 0 })
  likes: number

  @IsInt()
  @IsOptional()
  @prop({ type: Number, default: 0, min: 0 })
  dislikes: number

  @IsIP()
  @IsOptional()
  @prop({ type: String, default: null })
  ip: string | null

  @prop({ type: Object, default: null })
  ip_location: Partial<IPLocation> | null

  @IsString()
  @IsOptional()
  @prop({ type: String, default: null })
  user_agent: string | null

  @Type(() => KeyValueModel)
  @ValidateNested({ each: true })
  @ArrayUnique()
  @IsArray()
  @IsOptional()
  @prop({ type: () => [KeyValueModel], _id: false, default: [] })
  extras: KeyValueModel[]

  @prop({ type: Date, default: Date.now, immutable: true })
  created_at?: Date

  @prop({ type: Date, default: Date.now })
  updated_at?: Date
}

export const CommentProvider = getProviderByTypegooseClass(Comment)
