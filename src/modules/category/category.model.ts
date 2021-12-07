/**
 * @file Category model
 * @module module/category/model
 * @author Surmon <https://github.com/surmon-china>
 */

import { Types } from 'mongoose'
import { AutoIncrementID } from '@typegoose/auto-increment'
import { prop, plugin, modelOptions } from '@typegoose/typegoose'
import { IsString, MaxLength, IsAlphanumeric, IsNotEmpty, IsArray, ArrayNotEmpty, ArrayUnique } from 'class-validator'
import { generalAutoIncrementIDConfig } from '@app/constants/increment.constant'
import { getProviderByTypegooseClass } from '@app/transformers/model.transformer'
import { mongoosePaginate } from '@app/utils/paginate'
import { Extend } from '@app/models/extend.model'

@plugin(mongoosePaginate)
@plugin(AutoIncrementID, generalAutoIncrementIDConfig)
@modelOptions({
  schemaOptions: {
    timestamps: {
      createdAt: 'create_at',
      updatedAt: 'update_at',
    },
  },
})
export class Category {
  @prop({ unique: true })
  id: number

  @IsNotEmpty({ message: '分类名称？' })
  @IsString({ message: '字符串？' })
  @prop({ required: true, validate: /\S+/ })
  name: string

  @IsNotEmpty({ message: '分类别名？' })
  @IsString({ message: '字符串？' })
  @IsAlphanumeric('en-US', { message: 'slug 只允许字母和数字' })
  @MaxLength(30)
  @prop({ required: true, validate: /\S+/ })
  slug: string

  @IsString({ message: '字符串？' })
  @prop()
  description: string

  @prop({ ref: Category, default: null })
  pid: Types.ObjectId

  @prop({ default: Date.now, immutable: true })
  create_at?: Date

  @prop({ default: Date.now })
  update_at?: Date

  @IsArray()
  @ArrayUnique()
  @prop({ _id: false, type: () => [Extend] })
  extends: Extend[]

  count?: number
}

export class CategoriesPayload {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  category_ids: Types.ObjectId[]
}

export const CategoryProvider = getProviderByTypegooseClass(Category)
