/**
 * @file General key value model
 * @module model/key-value
 * @author Surmon <https://github.com/surmon-china>
 */

import { prop } from '@typegoose/typegoose'
import { IsString, IsNotEmpty } from 'class-validator'

export class KeyValueModel {
  @IsString()
  @IsNotEmpty()
  @prop({ required: false, validate: /\S+/ })
  name: string

  @IsString()
  @IsNotEmpty()
  @prop({ required: false, validate: /\S+/ })
  value: string
}
