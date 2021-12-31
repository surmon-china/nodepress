/**
 * @file Article model
 * @module module/article/model
 * @author Surmon <https://github.com/surmon-china>
 */

import { Types } from 'mongoose'
import { AutoIncrementID } from '@typegoose/auto-increment'
import { prop, index, plugin, Ref, modelOptions } from '@typegoose/typegoose'
import {
  IsString,
  IsBoolean,
  IsNotEmpty,
  IsArray,
  IsOptional,
  IsDefined,
  IsIn,
  IsInt,
  MaxLength,
  Matches,
  ArrayNotEmpty,
  ArrayUnique,
} from 'class-validator'
import { generalAutoIncrementIDConfig } from '@app/constants/increment.constant'
import { getProviderByTypegooseClass } from '@app/transformers/model.transformer'
import { mongoosePaginate } from '@app/utils/paginate'
import { PublishState, PublicState, OriginState } from '@app/interfaces/biz.interface'
import { Category } from '@app/modules/category/category.model'
import { Extend } from '@app/models/extend.model'
import { Tag } from '@app/modules/tag/tag.model'

export function getDefaultMeta(): Meta {
  return {
    likes: 0,
    views: 0,
    comments: 0,
  }
}

export class Meta {
  @IsInt()
  @prop({ default: 0 })
  likes: number

  @IsInt()
  @prop({ default: 0 })
  views: number

  @IsInt()
  @prop({ default: 0 })
  comments: number
}

@plugin(mongoosePaginate)
@plugin(AutoIncrementID, generalAutoIncrementIDConfig)
@modelOptions({
  schemaOptions: {
    toObject: { getters: true },
    timestamps: {
      createdAt: 'create_at',
      updatedAt: 'update_at',
    },
  },
})
@index(
  { title: 'text', content: 'text', description: 'text' },
  {
    name: 'SearchIndex',
    weights: {
      title: 10,
      content: 3,
      description: 18,
    },
  }
)
export class Article {
  @prop({ unique: true })
  id: number

  @Matches(/^[a-zA-Z0-9-_]+$/)
  @IsString()
  @MaxLength(50)
  @IsOptional()
  @prop({ default: null, validate: /^[a-zA-Z0-9-_]+$/, index: true })
  slug: string

  @IsNotEmpty({ message: 'title?' })
  @IsString({ message: 'string?' })
  @prop({ required: true, validate: /\S+/, text: true })
  title: string

  @IsNotEmpty({ message: 'content?' })
  @IsString({ message: 'string?' })
  @prop({ required: true, validate: /\S+/, text: true })
  content: string

  @IsString()
  @prop({ text: true })
  description: string

  @IsDefined()
  @IsArray()
  @ArrayUnique()
  @prop({ type: () => [String] })
  keywords: string[]

  @IsString()
  @IsOptional()
  @prop()
  thumb: string

  // password
  @IsString({ message: 'string?' })
  @IsOptional()
  @prop({ default: '' })
  password: string

  // disabled comment
  @IsBoolean()
  @prop({ default: false })
  disabled_comment: boolean

  // publish state
  @IsDefined()
  @IsIn([PublishState.Draft, PublishState.Published, PublishState.Recycle])
  @IsInt({ message: 'PublishState?' })
  @prop({ enum: PublishState, default: PublishState.Published, index: true })
  state: PublishState

  // public state
  @IsDefined()
  @IsIn([PublicState.Public, PublicState.Secret, PublicState.Password])
  @IsInt({ message: 'PublicState?' })
  @prop({ enum: PublicState, default: PublicState.Public, index: true })
  public: PublicState

  // origin state
  @IsDefined()
  @IsIn([OriginState.Hybrid, OriginState.Original, OriginState.Reprint])
  @IsInt()
  @prop({ enum: OriginState, default: OriginState.Original, index: true })
  origin: OriginState

  // category
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @prop({ ref: () => Category, required: true, index: true })
  category: Ref<Category>[]

  // tag
  // https://typegoose.github.io/typegoose/docs/api/virtuals#virtual-populate
  @prop({ ref: () => Tag, index: true })
  tag: Ref<Tag>[]

  @prop({ _id: false })
  meta: Meta

  @prop({ default: Date.now, index: true, immutable: true })
  create_at?: Date

  @prop({ default: Date.now })
  update_at?: Date

  @IsArray()
  @ArrayUnique()
  @prop({ _id: false, default: [], type: () => [Extend] })
  extends: Extend[]

  // releted articles
  related?: Article[]
}

export class ArticlesPayload {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  article_ids: Types.ObjectId[]
}

export class ArticlesStatePayload extends ArticlesPayload {
  @IsDefined()
  @IsIn([PublishState.Draft, PublishState.Published, PublishState.Recycle])
  @IsInt({ message: 'PublishState?' })
  @prop({ enum: PublishState, default: PublishState.Published })
  state: PublishState
}

export const ArticleProvider = getProviderByTypegooseClass(Article)
