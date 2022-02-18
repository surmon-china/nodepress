/**
 * @file Article model
 * @module module/article/model
 * @author Surmon <https://github.com/surmon-china>
 */

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
import { Language, SortType, PublishState, PublicState, OriginState } from '@app/constants/biz.constant'
import { generalAutoIncrementIDConfig } from '@app/constants/increment.constant'
import { getProviderByTypegooseClass } from '@app/transformers/model.transformer'
import { mongoosePaginate } from '@app/utils/paginate'
import { Category } from '@app/modules/category/category.model'
import { ExtendModel } from '@app/models/extend.model'
import { Tag } from '@app/modules/tag/tag.model'

export const ARTICLE_LANGUAGES = [Language.English, Language.Chinese] as const
export const ARTICLE_PUBLISH_STATES = [PublishState.Draft, PublishState.Published, PublishState.Recycle] as const
export const ARTICLE_PUBLIC_STATES = [PublicState.Public, PublicState.Secret, PublicState.Reserve] as const
export const ARTICLE_ORIGIN_STATES = [OriginState.Original, OriginState.Reprint, OriginState.Hybrid] as const

export const ARTICLE_FULL_QUERY_REF_POPULATE = ['category', 'tag']
export const ARTICLE_LIST_QUERY_PROJECTION = { content: false }
export const ARTICLE_LIST_QUERY_GUEST_FILTER = Object.freeze({
  state: PublishState.Published,
  public: PublicState.Public,
})

export const ARTICLE_HOTTEST_SORT_PARAMS = Object.freeze({
  'meta.comments': SortType.Desc,
  'meta.likes': SortType.Desc,
})

const ARTICLE_DEFAULT_META: ArticleMeta = Object.freeze({
  likes: 0,
  views: 0,
  comments: 0,
})

export class ArticleMeta {
  @IsInt()
  @prop({ default: 0 })
  likes: number

  @IsInt()
  @prop({ default: 0 })
  views: number

  // MARK: keep comments field manual
  // 1. `.sort()` can't by other model schema
  // https://stackoverflow.com/questions/66174791/how-to-access-a-different-schema-in-a-virtual-method
  // 2. `virtual` can't support publicOnly params and can't access other schema
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
      description: 18,
      content: 3,
    },
  }
)
export class Article {
  @prop({ unique: true })
  id: number

  @Matches(/^[a-zA-Z0-9-_]+$/)
  @MaxLength(50)
  @IsString()
  @IsOptional()
  @prop({ default: null, validate: /^[a-zA-Z0-9-_]+$/, index: true })
  slug: string

  @IsString()
  @IsNotEmpty({ message: 'title?' })
  @prop({ required: true, validate: /\S+/, text: true })
  title: string

  @IsString()
  @IsNotEmpty({ message: 'content?' })
  @prop({ required: true, validate: /\S+/, text: true })
  content: string

  @IsString()
  @prop({ text: true })
  description: string

  @ArrayUnique()
  @IsArray()
  @IsDefined()
  @prop({ type: () => [String] })
  keywords: string[]

  @IsString()
  @IsOptional()
  @prop()
  thumb: string

  // publish state
  @IsIn(ARTICLE_PUBLISH_STATES)
  @IsInt()
  @IsDefined()
  @prop({ enum: PublishState, default: PublishState.Published, index: true })
  state: PublishState

  // public state
  @IsIn(ARTICLE_PUBLIC_STATES)
  @IsInt()
  @IsDefined()
  @prop({ enum: PublicState, default: PublicState.Public, index: true })
  public: PublicState

  // origin state
  @IsIn(ARTICLE_ORIGIN_STATES)
  @IsInt()
  @IsDefined()
  @prop({ enum: OriginState, default: OriginState.Original, index: true })
  origin: OriginState

  // category
  @ArrayUnique()
  @ArrayNotEmpty()
  @IsArray()
  @prop({ ref: () => Category, required: true, index: true })
  category: Ref<Category>[]

  // tag
  // https://typegoose.github.io/typegoose/docs/api/virtuals#virtual-populate
  @prop({ ref: () => Tag, index: true })
  tag: Ref<Tag>[]

  // language
  // MARK: can't use 'language' field
  // https://docs.mongodb.com/manual/tutorial/specify-language-for-text-index/
  // https://docs.mongodb.com/manual/reference/text-search-languages/#std-label-text-search-languages
  @IsIn(ARTICLE_LANGUAGES)
  @IsString()
  @IsDefined()
  @prop({ default: Language.Chinese, index: true })
  lang: Language

  // disabled comment
  @IsBoolean()
  @prop({ default: false })
  disabled_comment: boolean

  @prop({ _id: false, default: { ...ARTICLE_DEFAULT_META } })
  meta: ArticleMeta

  @prop({ default: Date.now, index: true, immutable: true })
  create_at?: Date

  @prop({ default: Date.now })
  update_at?: Date

  @ArrayUnique()
  @IsArray()
  @prop({ _id: false, default: [], type: () => [ExtendModel] })
  extends: ExtendModel[]
}

export const ArticleProvider = getProviderByTypegooseClass(Article)
