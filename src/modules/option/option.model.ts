/**
 * @file Option model
 * @module module/option/model
 * @author Surmon <https://github.com/surmon-china>
 */

import { prop, modelOptions } from '@typegoose/typegoose'
import { Type } from 'class-transformer'
import {
  IsString,
  IsEmail,
  IsOptional,
  IsInt,
  IsObject,
  IsUrl,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  ArrayUnique,
} from 'class-validator'
import { getProviderByTypegooseClass } from '@app/transformers/model.transformer'

export const DEFAULT_OPTION: Option = Object.freeze<Option>({
  title: 'NodePress',
  sub_title: 'blog server app',
  description: 'RESTful API service for blog',
  keywords: [],
  site_url: 'https://github.com/surmon-china/nodepress',
  site_email: 'admin@example.com',
  blocklist: {
    ips: [],
    mails: [],
    keywords: [],
  },
  meta: { likes: 0 },
  ad_config: '',
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
    timestamps: {
      createdAt: false,
      updatedAt: 'update_at',
    },
  },
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
  @prop({ type: () => [String], default: [] })
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

  // site meta info
  @prop({ _id: false, default: { ...DEFAULT_OPTION.meta } })
  meta: AppMeta

  // site user block list
  @Type(() => Blocklist)
  @ValidateNested()
  @IsObject()
  @IsOptional()
  @prop({ _id: false, default: { ...DEFAULT_OPTION.blocklist } })
  blocklist: Blocklist

  // ad config
  @IsString()
  @IsOptional()
  @prop({ default: '' })
  ad_config: string

  @prop({ default: Date.now })
  update_at?: Date
}

export const OptionProvider = getProviderByTypegooseClass(Option)
