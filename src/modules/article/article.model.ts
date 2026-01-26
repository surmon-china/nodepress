/**
 * @file Article model
 * @module module/article/model
 * @author Surmon <https://github.com/surmon-china>
 */

import { AutoIncrementID } from '@typegoose/auto-increment'
import { prop, index, plugin, Ref, modelOptions } from '@typegoose/typegoose'
import { Type } from 'class-transformer'
import { IsString, IsBoolean, IsArray, IsIn, IsInt, ArrayNotEmpty, ArrayUnique } from 'class-validator'
import { IsNotEmpty, IsOptional, IsDefined, Matches, MaxLength, ValidateNested } from 'class-validator'
import { GENERAL_DB_AUTO_INCREMENT_ID_CONFIG } from '@app/constants/database.constant'
import { getProviderByTypegooseClass } from '@app/transformers/model.transformer'
import { mongoosePaginate } from '@app/utils/paginate'
import { KeyValueModel } from '@app/models/key-value.model'
import { Category } from '@app/modules/category/category.model'
import { Tag } from '@app/modules/tag/tag.model'
import { ArticleStatus, ArticleOrigin, ArticleLanguage } from './article.constant'
import { ARTICLE_STATUSES, ARTICLE_ORIGINS, ARTICLE_LANGUAGES } from './article.constant'

const ARTICLE_DEFAULT_STATS: ArticleStats = Object.freeze({
  likes: 0,
  views: 0,
  comments: 0
})

export class ArticleStats {
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

  @Matches(/^[a-zA-Z0-9-_]+$/)
  @MaxLength(50)
  @IsString()
  @IsOptional()
  @prop({ default: null, trim: true, validate: /^[a-zA-Z0-9-_]+$/, index: true })
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
  @prop({ default: '', text: true })
  summary: string

  @ArrayUnique()
  @IsArray()
  @IsDefined()
  @prop({ default: [], type: () => [String] })
  keywords: string[]

  @IsString()
  @IsOptional()
  @prop({ type: String, default: null })
  thumbnail: string | null

  @IsIn(ARTICLE_STATUSES)
  @IsInt()
  @IsDefined()
  @prop({ enum: ArticleStatus, default: ArticleStatus.Published, index: true })
  status: ArticleStatus

  // origin state
  @IsIn(ARTICLE_ORIGINS)
  @IsInt()
  @IsDefined()
  @prop({ enum: ArticleOrigin, default: ArticleOrigin.Original, index: true })
  origin: ArticleOrigin

  // language
  // MARK: can't use 'language' field
  // https://docs.mongodb.com/manual/tutorial/specify-language-for-text-index/
  // https://docs.mongodb.com/manual/reference/text-search-languages/#std-label-text-search-languages
  @IsIn(ARTICLE_LANGUAGES)
  @IsString()
  @IsDefined()
  @prop({ default: ArticleLanguage.Chinese, index: true })
  lang: ArticleLanguage

  // featured
  @IsBoolean()
  @prop({ default: false, index: true })
  featured: boolean

  // disabled comments
  @IsBoolean()
  @prop({ default: false })
  disabled_comments: boolean

  @prop({ _id: false, default: { ...ARTICLE_DEFAULT_STATS } })
  stats: ArticleStats

  @Type(() => KeyValueModel)
  @ValidateNested()
  @ArrayUnique()
  @IsArray()
  @prop({ _id: false, default: [], type: () => [KeyValueModel] })
  extras: KeyValueModel[]

  // tag
  // https://typegoose.github.io/typegoose/docs/api/virtuals#virtual-populate
  @prop({ ref: () => Tag, index: true })
  tags: Ref<Tag>[]

  // category
  @ArrayUnique()
  @ArrayNotEmpty()
  @IsArray()
  @prop({ ref: () => Category, required: true, index: true })
  categories: Ref<Category>[]

  @prop({ default: Date.now, index: true, immutable: true })
  created_at?: Date

  @prop({ default: Date.now })
  updated_at?: Date
}

export const ArticleProvider = getProviderByTypegooseClass(Article)
