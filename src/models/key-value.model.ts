/**
 * @file General key value model
 * @module model/key-value
 * @author Surmon <https://github.com/surmon-china>
 */

import { prop } from '@typegoose/typegoose'
import { Transform } from 'class-transformer'
import { IsString, IsNotEmpty, IsOptional } from 'class-validator'

export class KeyValueModel {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @prop({ type: String, required: true, trim: true, validate: /\S+/ })
  key: string

  @IsString()
  @IsOptional()
  @prop({ type: String, required: false })
  value: string
}
