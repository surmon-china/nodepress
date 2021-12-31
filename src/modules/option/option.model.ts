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

export const DEFAULT_OPTION = Object.freeze<Option>({
  title: '',
  sub_title: '',
  description: '',
  keywords: [],
  site_url: '',
  site_email: '',
  blocklist: {
    ips: [],
    mails: [],
    keywords: [],
  },
  meta: { likes: 0 },
  ad_config: '',
})

class Meta {
  @IsInt()
  @prop({ default: 0 })
  likes: number
}

// user block list
export class Blocklist {
  @IsArray()
  @ArrayUnique()
  @IsOptional()
  @prop({ type: () => [String], default: [] })
  ips: string[]

  @IsArray()
  @ArrayUnique()
  @IsOptional()
  @prop({ type: () => [String], default: [] })
  mails: string[]

  @IsArray()
  @ArrayUnique()
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
  @IsNotEmpty({ message: 'title?' })
  @IsString()
  @prop({ required: true, validate: /\S+/ })
  title: string

  @IsNotEmpty({ message: 'sub title?' })
  @IsString()
  @prop({ required: true, validate: /\S+/ })
  sub_title: string

  @IsNotEmpty()
  @IsString()
  @prop({ required: true })
  description: string

  @IsArray()
  @ArrayUnique()
  @IsOptional()
  @prop({ type: () => [String], default: [] })
  keywords: string[]

  @IsNotEmpty()
  @IsString()
  @IsUrl({ require_protocol: true })
  @prop({ required: true })
  site_url: string

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @prop({ required: true })
  site_email: string

  // site meta info
  @prop({ _id: false })
  meta: Meta

  // site user block list
  @Type(() => Blocklist)
  @ValidateNested()
  @IsObject()
  @IsOptional()
  @prop({ _id: false })
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
