/**
 * @file Tag model
 * @module module/tag/model
 * @author Surmon <https://github.com/surmon-china>
 */

import { AutoIncrementID } from '@typegoose/auto-increment'
import { prop, plugin, modelOptions } from '@typegoose/typegoose'
import { Type } from 'class-transformer'
import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator'
import { MaxLength, Matches, ArrayUnique, ValidateNested } from 'class-validator'
import { NormalizeString } from '@app/decorators/normalize-string.decorator'
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
export class Tag {
  @prop({ unique: true })
  id: number

  @IsNotEmpty()
  @IsString()
  @NormalizeString({ trim: true })
  @prop({ type: String, required: true, trim: true, validate: /\S+/ })
  name: string

  @MaxLength(30)
  @Matches(/^[a-zA-Z0-9-_]+$/)
  @IsNotEmpty()
  @IsString()
  @NormalizeString({ trim: true })
  @prop({ type: String, required: true, unique: true, trim: true, validate: /^[a-zA-Z0-9-_]+$/ })
  slug: string

  @IsString()
  @IsOptional()
  @NormalizeString({ trim: true })
  @prop({ type: String, default: '', trim: true })
  description: string

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

  // for article aggregate
  article_count?: number
}

export const TagProvider = getProviderByTypegooseClass(Tag)
