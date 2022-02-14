/**
 * @file General extend model
 * @module model/extend
 * @author Surmon <https://github.com/surmon-china>
 */

import { prop } from '@typegoose/typegoose'
import { IsString, IsNotEmpty } from 'class-validator'

export class ExtendModel {
  @IsString()
  @IsNotEmpty()
  @prop({ required: false, validate: /\S+/ })
  name: string

  @IsString()
  @IsNotEmpty()
  @prop({ required: false, validate: /\S+/ })
  value: string
}
