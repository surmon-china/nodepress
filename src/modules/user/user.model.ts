/**
 * @file User model
 * @module module/user/model
 * @author Surmon <https://github.com/surmon-china>
 */

import { AutoIncrementID } from '@typegoose/auto-increment'
import { prop, index, plugin, modelOptions } from '@typegoose/typegoose'
import { Type, Transform } from 'class-transformer'
import { IsOptional, IsDefined, IsNotEmpty, ValidateNested, ArrayUnique } from 'class-validator'
import { IsString, IsBoolean, IsEnum, IsUrl, IsEmail, IsArray, MaxLength } from 'class-validator'
import { GENERAL_DB_AUTO_INCREMENT_ID_CONFIG } from '@app/constants/database.constant'
import { getProviderByTypegooseClass } from '@app/transformers/model.transformer'
import { mongoosePaginate } from '@app/utils/paginate'
import { KeyValueModel } from '@app/models/key-value.model'
import { UserType, UserIdentityProvider } from './user.constant'

export const USER_PUBLIC_POPULATE_SELECT = ['id', 'type', 'name', 'website', 'avatar_url'] as const
export type UserPublic = Required<Pick<User, (typeof USER_PUBLIC_POPULATE_SELECT)[number]>>

export class UserIdentity {
  @IsEnum(UserIdentityProvider)
  @IsDefined()
  @prop({ type: String, enum: UserIdentityProvider, required: true })
  provider: UserIdentityProvider

  @IsNotEmpty()
  @IsString()
  @prop({ type: String, required: true })
  uid: string

  @IsEmail()
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @prop({ type: String, default: null, trim: true })
  email: string | null

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @prop({ type: String, default: null, trim: true })
  username: string | null

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @prop({ type: String, default: null, trim: true })
  display_name: string | null

  @IsUrl()
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @prop({ type: String, default: null, trim: true })
  avatar_url: string | null

  @IsUrl()
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @prop({ type: String, default: null, trim: true })
  profile_url: string | null

  @prop({ type: Date, default: Date.now })
  linked_at?: Date
}

@plugin(mongoosePaginate)
@plugin(AutoIncrementID, GENERAL_DB_AUTO_INCREMENT_ID_CONFIG)
@index({ 'identities.provider': 1, 'identities.uid': 1 }, { unique: true, sparse: true })
@modelOptions({
  schemaOptions: {
    id: false,
    versionKey: false,
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
})
export class User {
  @prop({ unique: true })
  id: number

  @IsEnum(UserType)
  @IsOptional()
  @prop({ type: Number, enum: UserType, default: UserType.Standard, index: true })
  type: UserType

  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @prop({ type: String, required: true, trim: true, validate: /\S+/, maxlength: 100 })
  name: string

  // Email may be `null` if the user has enabled privacy settings on the provider.
  @IsEmail()
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @prop({ type: String, default: null, trim: true })
  email: string | null

  @MaxLength(500)
  @IsUrl({ require_protocol: true })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @prop({ type: String, default: null, trim: true, maxlength: 500 })
  website: string | null

  @MaxLength(500)
  @IsUrl()
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @prop({ type: String, default: null, trim: true, maxlength: 500 })
  avatar_url: string | null

  @Type(() => UserIdentity)
  @ValidateNested({ each: true })
  @ArrayUnique()
  @IsArray()
  @IsOptional()
  @prop({ type: () => [UserIdentity], _id: false, default: [] })
  identities: UserIdentity[]

  @Type(() => KeyValueModel)
  @ValidateNested({ each: true })
  @ArrayUnique()
  @IsArray()
  @IsOptional()
  @prop({ type: () => [KeyValueModel], _id: false, default: [] })
  extras: KeyValueModel[]

  @IsBoolean()
  @IsOptional()
  @prop({ type: Boolean, default: false, index: true })
  disabled: boolean

  @prop({ type: Date, default: Date.now, immutable: true })
  created_at?: Date

  @prop({ type: Date, default: Date.now })
  updated_at?: Date
}

export const UserProvider = getProviderByTypegooseClass(User)
