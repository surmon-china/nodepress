/**
 * @file Article model
 * @module module/article/model
 * @author Surmon <https://github.com/surmon-china>
 */

import type { MergeType } from 'mongoose'
import { AutoIncrementID } from '@typegoose/auto-increment'
import { prop, index, plugin, Ref, modelOptions } from '@typegoose/typegoose'
import { Type } from 'class-transformer'
import { IsString, IsBoolean, IsEnum, IsArray, ArrayNotEmpty, ArrayUnique } from 'class-validator'
import { IsNotEmpty, IsOptional, Matches, MaxLength, ValidateNested } from 'class-validator'
import { NormalizeString } from '@app/decorators/normalize-string.decorator'
import { GENERAL_DB_AUTO_INCREMENT_ID_CONFIG } from '@app/constants/database.constant'
import { getProviderByTypegooseClass } from '@app/transformers/model.transformer'
import { MongooseDoc } from '@app/interfaces/mongoose.interface'
import { mongoosePaginate } from '@app/utils/paginate'
import { KeyValueModel } from '@app/models/key-value.model'
import { Category } from '@app/modules/category/category.model'
import { Tag } from '@app/modules/tag/tag.model'
import { ArticleStatus, ArticleOrigin, ArticleLanguage } from './article.constant'

export type ArticleDoc = MongooseDoc<Article>
export type ArticlePopulated = MergeType<Article, { tags: Tag[]; categories: Category[] }>
export type ArticleDocPopulated = MergeType<ArticleDoc, { tags: Tag[]; categories: Category[] }>
export const ARTICLE_RELATION_FIELDS = ['tags', 'categories']

export type ArticleListItemPopulated = Omit<ArticlePopulated, 'content' | 'extras'>
export const ARTICLE_LIST_QUERY_PROJECTION = { content: 0, extras: 0 }

const ARTICLE_DEFAULT_STATS: ArticleStats = Object.freeze({
  likes: 0,
  views: 0,
  comments: 0
})

export class ArticleStats {
  @prop({ type: Number, default: 0, min: 0 })
  likes: number

  @prop({ type: Number, default: 0, min: 0 })
  views: number

  @prop({ type: Number, default: 0, min: 0 })
  comments: number
}

@plugin(mongoosePaginate)
@plugin(AutoIncrementID, GENERAL_DB_AUTO_INCREMENT_ID_CONFIG)
@modelOptions({
  schemaOptions: {
    id: false,
    versionKey: false,
    toObject: { getters: true },
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
})
// index article list page
@index({ status: 1, created_at: -1 })
// tag article list page
@index({ tags: 1, status: 1, created_at: -1 })
// category article list page
@index({ categories: 1, status: 1, created_at: -1 })
// search list
@index(
  { title: 'text', content: 'text', summary: 'text' },
  {
    name: 'SearchIndex',
    weights: {
      title: 10,
      summary: 12,
      content: 8
    }
  }
)
export class Article {
  @prop({ unique: true })
  id: number

  @MaxLength(50)
  @Matches(/^[a-zA-Z0-9-_]+$/)
  @IsString()
  @IsOptional()
  @NormalizeString({ trim: true })
  @prop({ type: String, default: null, unique: true, index: true, trim: true, validate: /^[a-zA-Z0-9-_]+$/ })
  slug: string | null

  @IsString()
  @IsNotEmpty()
  @prop({ type: String, required: true, validate: /\S+/, text: true })
  title: string

  @IsString()
  @IsNotEmpty()
  @prop({ type: String, required: true, validate: /\S+/, text: true })
  content: string

  @IsString()
  @IsOptional()
  @prop({ type: String, default: '', text: true })
  summary: string

  @IsString({ each: true })
  @ArrayUnique()
  @IsArray()
  @IsOptional()
  @prop({ type: () => [String], default: [] })
  keywords: string[]

  @IsString()
  @IsOptional()
  @prop({ type: String, default: null, trim: true })
  thumbnail: string | null

  @IsEnum(ArticleStatus)
  @IsOptional()
  @prop({ type: Number, enum: ArticleStatus, default: ArticleStatus.Published, index: true })
  status: ArticleStatus

  @IsEnum(ArticleOrigin)
  @IsOptional()
  @prop({ type: Number, enum: ArticleOrigin, default: ArticleOrigin.Original })
  origin: ArticleOrigin

  // language
  // MARK: can't use 'language' field
  // https://docs.mongodb.com/manual/tutorial/specify-language-for-text-index/
  // https://docs.mongodb.com/manual/reference/text-search-languages/#std-label-text-search-languages
  @IsEnum(ArticleLanguage)
  @IsOptional()
  @prop({ type: String, enum: ArticleLanguage, default: ArticleLanguage.Chinese })
  lang: ArticleLanguage

  @IsBoolean()
  @IsOptional()
  @prop({ type: Boolean, default: false, index: true })
  featured: boolean

  @IsBoolean()
  @IsOptional()
  @prop({ type: Boolean, default: false })
  disabled_comments: boolean

  @prop({ type: () => ArticleStats, _id: false, default: { ...ARTICLE_DEFAULT_STATS } })
  stats: ArticleStats

  @ArrayUnique()
  @IsArray()
  @IsOptional()
  @prop({ ref: () => Tag, default: [] })
  tags: Ref<Tag>[]

  @ArrayUnique()
  @ArrayNotEmpty()
  @IsArray()
  @prop({ ref: () => Category, required: true })
  categories: Ref<Category>[]

  @Type(() => KeyValueModel)
  @ValidateNested({ each: true })
  @ArrayUnique()
  @IsArray()
  @IsOptional()
  @prop({ type: () => [KeyValueModel], _id: false, default: [] })
  extras: KeyValueModel[]

  @prop({ type: Date, default: Date.now, immutable: true, index: true })
  created_at?: Date

  @prop({ type: Date, default: Date.now })
  updated_at?: Date
}

export const ArticleProvider = getProviderByTypegooseClass(Article)
