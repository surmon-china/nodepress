/**
 * @file General extend model
 * @module model/extend
 * @author Surmon <https://github.com/surmon-china>
 */

import { prop } from '@typegoose/typegoose'
import { IsString, IsNotEmpty } from 'class-validator'

export class Extend {
  @IsNotEmpty()
  @IsString()
  @prop({ required: false, validate: /\S+/ })
  name: string

  @IsNotEmpty()
  @IsString()
  @prop({ required: false, validate: /\S+/ })
  value: string
}
