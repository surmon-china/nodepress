/**
 * @file Admin model
 * @module module/admin/model
 * @author Surmon <https://github.com/surmon-china>
 */

import { prop, modelOptions } from '@typegoose/typegoose'
import { getProviderByTypegooseClass } from '@app/transformers/model.transformer'

export type AdminProfile = Omit<Admin, 'singleton' | 'password'>

export const ADMIN_SINGLETON_QUERY = Object.freeze({ singleton: true } as const)

export const DEFAULT_ADMIN_PROFILE = Object.freeze<AdminProfile>({
  name: 'Admin',
  slogan: 'This is admin slogan',
  avatar_url: ''
})

@modelOptions({
  schemaOptions: {
    versionKey: false
  }
})
export class Admin {
  @prop({ type: Boolean, default: true, unique: true, select: false })
  singleton?: boolean

  @prop({ type: String, required: true, validate: /\S+/, select: false })
  password: string

  @prop({ type: String, required: true, trim: true, validate: /\S+/ })
  name: string

  @prop({ type: String, default: '', trim: true })
  slogan: string

  @prop({ type: String, default: '', trim: true })
  avatar_url: string
}

export const AdminProvider = getProviderByTypegooseClass(Admin)
