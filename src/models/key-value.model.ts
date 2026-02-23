/**
 * @file General key value model
 * @module model/key-value
 * @author Surmon <https://github.com/surmon-china>
 */

import { prop } from '@typegoose/typegoose'
import { IsString, IsNotEmpty, IsOptional } from 'class-validator'
import { NormalizeString } from '@app/decorators/normalize-string.decorator'

export class KeyValueModel {
  @IsString()
  @IsNotEmpty()
  @NormalizeString({ trim: true })
  @prop({ type: String, required: true, trim: true, validate: /\S+/ })
  key: string

  @IsString()
  @IsOptional()
  @prop({ type: String, required: false })
  value: string
}
