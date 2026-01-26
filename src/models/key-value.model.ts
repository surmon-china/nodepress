/**
 * @file General key value model
 * @module model/key-value
 * @author Surmon <https://github.com/surmon-china>
 */

import { prop } from '@typegoose/typegoose'
import { IsString, IsNotEmpty, IsOptional } from 'class-validator'

export class KeyValueModel {
  @IsString()
  @IsNotEmpty()
  @prop({ required: true, trim: true, validate: /\S+/ })
  key: string

  @IsString()
  @IsOptional()
  @prop({ required: false })
  value: string
}
