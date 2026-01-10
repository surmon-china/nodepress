/**
 * @file Option model
 * @module module/option/model
 * @author Surmon <https://github.com/surmon-china>
 */

import { prop, modelOptions } from '@typegoose/typegoose'
import { Type } from 'class-transformer'
import { IsString, IsInt, IsObject, IsUrl, IsEmail, IsArray } from 'class-validator'
import { IsOptional, IsNotEmpty, ValidateNested, ArrayUnique } from 'class-validator'
import { KeyValueModel } from '@app/models/key-value.model'
import { getProviderByTypegooseClass } from '@app/transformers/model.transformer'
import { APP_BIZ } from '@app/app.config'

const DEFAULT_OPTION_APP_META: AppMeta = Object.freeze({
  likes: 0
})

const DEFAULT_OPTION_BLOCKLIST: Blocklist = Object.freeze({
  ips: [],
  mails: [],
  keywords: []
})

export const DEFAULT_OPTION: Option = Object.freeze<Option>({
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
      value: APP_BIZ.FE_URL
    }
  ],
  meta: DEFAULT_OPTION_APP_META,
  blocklist: DEFAULT_OPTION_BLOCKLIST,
  app_config: ''
})

class AppMeta {
  @IsInt()
  @prop({ default: 0 })
  likes: number
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

  @ArrayUnique()
  @IsArray()
  @prop({ _id: false, default: [], type: () => [KeyValueModel] })
  friend_links: KeyValueModel[]

  // site meta info
  @prop({ _id: false, default: { ...DEFAULT_OPTION_APP_META } })
  meta: AppMeta

  // site user block list
  @Type(() => Blocklist)
  @ValidateNested()
  @IsObject()
  @IsOptional()
  @prop({ _id: false, default: { ...DEFAULT_OPTION_BLOCKLIST } })
  blocklist: Blocklist

  // app config (for broader client configuration usage)
  @IsString()
  @IsOptional()
  @prop({ type: String, default: null })
  app_config: string | null

  @prop({ default: Date.now })
  updated_at?: Date
}

export const OptionProvider = getProviderByTypegooseClass(Option)
