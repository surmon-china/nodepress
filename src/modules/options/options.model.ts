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

const DEFAULT_OPTIONS_BLOCKLIST: Blocklist = Object.freeze({
  ips: [],
  mails: [],
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
  friend_links: [
    {
      name: APP_BIZ.FE_NAME,
      url: APP_BIZ.FE_URL
    }
  ],
  blocklist: DEFAULT_OPTIONS_BLOCKLIST,
  app_config: ''
})

export class FriendLink {
  @IsString()
  @IsNotEmpty()
  @prop({ required: true, trim: true, validate: /\S+/ })
  name: string

  @IsUrl({ require_protocol: true })
  @IsString()
  @IsNotEmpty()
  @prop({ required: true, trim: true })
  url: string
}

// user block list
export class Blocklist {
  @ArrayUnique()
  @IsArray()
  @IsOptional()
  @prop({ type: () => [String], default: [] })
  ips: string[]

  @ArrayUnique()
  @IsArray()
  @IsOptional()
  @prop({ type: () => [String], default: [] })
  mails: string[]

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
  @IsString()
  @IsNotEmpty({ message: 'title?' })
  @prop({ required: true, validate: /\S+/ })
  title: string

  @IsString()
  @IsNotEmpty({ message: 'sub title?' })
  @prop({ required: true, validate: /\S+/ })
  sub_title: string

  @IsString()
  @IsNotEmpty()
  @prop({ required: true })
  description: string

  @ArrayUnique()
  @IsArray()
  @IsOptional()
  @prop({ default: [], type: () => [String] })
  keywords: string[]

  @IsUrl({ require_protocol: true })
  @IsString()
  @IsNotEmpty()
  @prop({ required: true })
  site_url: string

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @prop({ required: true })
  site_email: string

  @IsString()
  @IsOptional()
  @prop({ default: '' })
  statement: string

  @Type(() => FriendLink)
  @ValidateNested()
  @ArrayUnique()
  @IsArray()
  @prop({ _id: false, default: [], type: () => [FriendLink] })
  friend_links: FriendLink[]

  // site user block list
  @Type(() => Blocklist)
  @ValidateNested()
  @IsObject()
  @IsOptional()
  @prop({ _id: false, default: { ...DEFAULT_OPTIONS_BLOCKLIST } })
  blocklist: Blocklist

  // app config (for broader client configuration usage)
  @IsString()
  @IsOptional()
  @prop({ type: String, default: null })
  app_config: string | null

  @prop({ default: Date.now })
  updated_at?: Date
}

export const OptionsProvider = getProviderByTypegooseClass(Option)
