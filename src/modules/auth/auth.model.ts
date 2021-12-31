/**
 * @file Auth & admin model
 * @module module/auth/model
 * @author Surmon <https://github.com/surmon-china>
 */

import { prop, modelOptions } from '@typegoose/typegoose'
import { IsString, IsDefined, IsNotEmpty, IsOptional } from 'class-validator'
import { getProviderByTypegooseClass } from '@app/transformers/model.transformer'

export const DEFAULT_AUTH = Object.freeze<Auth>({
  name: '',
  slogan: '',
  avatar: '',
})

@modelOptions({
  schemaOptions: {
    versionKey: false,
  },
})
export class Auth {
  @IsDefined()
  @IsString({ message: "what's your name?" })
  @prop({ required: true })
  name: string

  @IsDefined()
  @IsString({ message: 'slogan?' })
  @prop({ required: true })
  slogan: string

  @IsOptional()
  @IsString()
  @prop({ default: '' })
  avatar: string

  @IsString()
  @prop({ select: false })
  password?: string

  new_password?: string
}

export class AuthPasswordPayload {
  @IsDefined()
  @IsNotEmpty({ message: 'password?' })
  @IsString({ message: 'password must be string type' })
  password: string
}

export const AuthProvider = getProviderByTypegooseClass(Auth)
