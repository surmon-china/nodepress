/**
 * @file Tag model
 * @module module/tag/model
 * @author Surmon <https://github.com/surmon-china>
 */

import { Types } from 'mongoose'
import { AutoIncrementID } from '@typegoose/auto-increment'
import { prop, plugin, modelOptions } from '@typegoose/typegoose'
import { IsString, MaxLength, Matches, IsNotEmpty, IsArray, ArrayNotEmpty, ArrayUnique } from 'class-validator'
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

  @IsArray()
  @ArrayUnique()
  @prop({ _id: false, default: [], type: () => [Extend] })
  extends: Extend[]

  @prop({ default: Date.now, immutable: true })
  create_at?: Date

  @prop({ default: Date.now })
  update_at?: Date

  // for article aggregate
  count?: number
}

export class TagsPayload {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  tag_ids: Types.ObjectId[]
}

export const TagProvider = getProviderByTypegooseClass(Tag)
