/**
 * @file Options model
 * @module module/options/model
 * @author Surmon <https://github.com/surmon-china>
 */

import { prop, modelOptions } from '@typegoose/typegoose'
import { Type } from 'class-transformer'
import { ValidateNested, ArrayUnique } from 'class-validator'
import { IsString, IsObject, IsUrl, IsEmail, IsArray, IsOptional, IsNotEmpty } from 'class-validator'
import { getProviderByTypegooseClass } from '@app/transformers/model.transformer'
import { APP_BIZ } from '@app/app.config'

export type OptionPublic = Omit<Option, 'blocklist'>

export const OPTIONS_SINGLETON_QUERY = Object.freeze({ singleton: true } as const)

const DEFAULT_OPTIONS_BLOCKLIST: Blocklist = Object.freeze({
  ips: [],
  emails: [],
  keywords: []
})

export const DEFAULT_OPTIONS: Option = Object.freeze<Option>({
  title: 'NodePress',
  sub_title: 'Blog server app',
  description: 'RESTful API service for blog',
  keywords: [],
  statement: '',
  site_url: 'https://github.com/surmon-china/nodepress',
  site_email: 'admin@example.com',
  friend_links: [{ name: APP_BIZ.FE_NAME, url: APP_BIZ.FE_URL }],
  blocklist: DEFAULT_OPTIONS_BLOCKLIST,
  app_config: ''
})

export class FriendLink {
  @IsString()
  @IsNotEmpty()
  @prop({ type: String, required: true, trim: true, validate: /\S+/ })
  name: string

  @IsUrl({ require_protocol: true })
  @IsString()
  @IsNotEmpty()
  @prop({ type: String, required: true, trim: true })
  url: string
}

export class Blocklist {
  @ArrayUnique()
  @IsArray()
  @IsOptional()
  @prop({ type: () => [String], default: [] })
  ips: string[]

  @IsEmail(undefined, { each: true })
  @ArrayUnique()
  @IsArray()
  @IsOptional()
  @prop({ type: () => [String], default: [] })
  emails: string[]

  @IsString({ each: true })
  @ArrayUnique()
  @IsArray()
  @IsOptional()
  @prop({ type: () => [String], default: [] })
  keywords: string[]
}

@modelOptions({
  schemaOptions: {
    versionKey: false,
    timestamps: {
      createdAt: false,
      updatedAt: 'updated_at'
    }
  }
})
export class Option {
  @prop({ type: Boolean, default: true, unique: true, select: false })
  singleton?: boolean

  @IsString()
  @IsNotEmpty()
  @prop({ type: String, required: true, trim: true, validate: /\S+/ })
  title: string

  @IsString()
  @IsNotEmpty()
  @prop({ type: String, required: true, trim: true, validate: /\S+/ })
  sub_title: string

  @IsString()
  @IsNotEmpty()
  @prop({ type: String, required: true, trim: true })
  description: string

  @IsString({ each: true })
  @ArrayUnique()
  @IsArray()
  @IsOptional()
  @prop({ type: () => [String], default: [] })
  keywords: string[]

  @IsUrl({ require_protocol: true })
  @IsString()
  @IsNotEmpty()
  @prop({ type: String, required: true })
  site_url: string

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @prop({ type: String, required: true })
  site_email: string

  @IsString()
  @IsOptional()
  @prop({ type: String, default: '' })
  statement: string

  @Type(() => FriendLink)
  @ValidateNested({ each: true })
  @ArrayUnique()
  @IsArray()
  @IsOptional()
  @prop({ type: () => [FriendLink], _id: false, default: [] })
  friend_links: FriendLink[]

  @Type(() => Blocklist)
  @ValidateNested()
  @IsObject()
  @IsOptional()
  @prop({ type: () => Blocklist, _id: false, default: { ...DEFAULT_OPTIONS_BLOCKLIST } })
  blocklist: Blocklist

  // app config (for broader client configuration usage)
  @IsString()
  @IsOptional()
  @prop({ type: String, default: null })
  app_config: string | null

  @prop({ type: Date, default: Date.now })
  updated_at?: Date
}

export const OptionsProvider = getProviderByTypegooseClass(Option)
