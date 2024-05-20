/**
 * @file Auth model
 * @module module/auth/model
 * @author Surmon <https://github.com/surmon-china>
 */

import { prop, modelOptions } from '@typegoose/typegoose'
import { IsString, IsDefined, IsOptional } from 'class-validator'
import { getProviderByTypegooseClass } from '@app/transformers/model.transformer'

export const DEFAULT_ADMIN_PROFILE = Object.freeze<Admin>({
  name: '',
  slogan: '',
  avatar: ''
})

@modelOptions({
  schemaOptions: {
    versionKey: false
  }
})
export class Admin {
  @IsString({ message: "what's your name?" })
  @IsDefined()
  @prop({ required: true })
  name: string

  @IsString()
  @IsDefined()
  @prop({ required: true })
  slogan: string

  @IsString()
  @IsOptional()
  @prop({ default: '' })
  avatar: string

  @IsString()
  @prop({ select: false })
  password?: string
}

export const AdminProvider = getProviderByTypegooseClass(Admin)
