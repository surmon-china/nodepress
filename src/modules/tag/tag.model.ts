/**
 * @file Tag model
 * @module module/tag/model
 * @author Surmon <https://github.com/surmon-china>
 */

import { AutoIncrementID } from '@typegoose/auto-increment'
import { prop, plugin, modelOptions } from '@typegoose/typegoose'
import { IsString, MaxLength, Matches, IsNotEmpty, IsArray, ArrayUnique } from 'class-validator'
import { generalAutoIncrementIDConfig } from '@app/constants/increment.constant'
import { getProviderByTypegooseClass } from '@app/transformers/model.transformer'
import { mongoosePaginate } from '@app/utils/paginate'
import { ExtendModel } from '@app/models/extend.model'

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
export class Tag {
  @prop({ unique: true })
  id: number

  @IsNotEmpty()
  @IsString()
  @prop({ required: true, validate: /\S+/ })
  name: string

  @Matches(/^[a-zA-Z0-9-_]+$/)
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  @prop({ required: true, validate: /^[a-zA-Z0-9-_]+$/, unique: true })
  slug: string

  @IsString({ message: 'description must be string type' })
  @prop()
  description: string

  @prop({ default: Date.now, immutable: true })
  create_at?: Date

  @prop({ default: Date.now })
  update_at?: Date

  @IsArray()
  @ArrayUnique()
  @prop({ _id: false, default: [], type: () => [ExtendModel] })
  extends: ExtendModel[]

  // for article aggregate
  articles_count?: number
}

export const TagProvider = getProviderByTypegooseClass(Tag)
