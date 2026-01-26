/**
 * @file Category model
 * @module module/category/model
 * @author Surmon <https://github.com/surmon-china>
 */

import { Types } from 'mongoose'
import { AutoIncrementID } from '@typegoose/auto-increment'
import { prop, plugin, modelOptions } from '@typegoose/typegoose'
import { Type } from 'class-transformer'
import { IsString, MaxLength, Matches, IsNotEmpty, IsArray, ArrayUnique, ValidateNested } from 'class-validator'
import { GENERAL_DB_AUTO_INCREMENT_ID_CONFIG } from '@app/constants/database.constant'
import { getProviderByTypegooseClass } from '@app/transformers/model.transformer'
import { mongoosePaginate } from '@app/utils/paginate'
import { KeyValueModel } from '@app/models/key-value.model'

@plugin(mongoosePaginate)
@plugin(AutoIncrementID, GENERAL_DB_AUTO_INCREMENT_ID_CONFIG)
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
export class Category {
  @prop({ unique: true })
  id: number

  @prop({ ref: Category, default: null })
  pid: Types.ObjectId

  @IsString()
  @IsNotEmpty()
  @prop({ required: true, validate: /\S+/ })
  name: string

  @Matches(/^[a-zA-Z0-9-_]+$/)
  @MaxLength(30)
  @IsString()
  @IsNotEmpty({ message: 'slug?' })
  @prop({ required: true, validate: /^[a-zA-Z0-9-_]+$/, unique: true })
  slug: string

  @IsString()
  @prop({ default: '' })
  description: string

  @Type(() => KeyValueModel)
  @ValidateNested()
  @ArrayUnique()
  @IsArray()
  @prop({ _id: false, default: [], type: () => [KeyValueModel] })
  extras: KeyValueModel[]

  @prop({ default: Date.now, immutable: true })
  created_at?: Date

  @prop({ default: Date.now })
  updated_at?: Date

  // for article aggregate
  article_count?: number
}

export const CategoryProvider = getProviderByTypegooseClass(Category)
