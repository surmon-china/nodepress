/**
 * @file Feedback model
 * @module module/feedback/model
 * @author Surmon <https://github.com/surmon-china>
 */

import type { MergeType } from 'mongoose'
import MongooseLeanVirtuals from 'mongoose-lean-virtuals'
import { AutoIncrementID } from '@typegoose/auto-increment'
import { prop, plugin, modelOptions, Ref, Severity } from '@typegoose/typegoose'
import { GENERAL_DB_AUTO_INCREMENT_ID_CONFIG } from '@app/constants/database.constant'
import { getProviderByTypegooseClass } from '@app/transformers/model.transformer'
import { mongoosePaginate } from '@app/utils/paginate'
import { IPLocation } from '@app/core/helper/helper.service.ip'
import { User } from '@app/modules/user/user.model'
import { GeneralAuthorType } from '@app/constants/author.constant'
import { FeedbackEmotion, emotionsMap } from './feedback.constant'

export type FeedbackWithUser = MergeType<Feedback, { user: User | null }>

@plugin(mongoosePaginate)
@plugin(MongooseLeanVirtuals)
@plugin(AutoIncrementID, GENERAL_DB_AUTO_INCREMENT_ID_CONFIG)
@modelOptions({
  options: { allowMixed: Severity.ALLOW },
  schemaOptions: {
    id: false,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
})
export class Feedback {
  @prop({ unique: true })
  id: number

  @prop({ type: Number, enum: FeedbackEmotion, required: true, index: true })
  emotion: FeedbackEmotion

  public get emotion_text() {
    return emotionsMap.get(this.emotion)?.text
  }

  public get emotion_emoji() {
    return emotionsMap.get(this.emotion)?.emoji
  }

  @prop({ type: String, required: true, trim: true, validate: /\S+/, maxlength: 3000 })
  content: string

  @prop({ type: String, enum: GeneralAuthorType, required: true, index: true })
  author_type: GeneralAuthorType

  @prop({ type: String, default: null })
  author_name: string | null

  @prop({ type: String, default: null })
  author_email: string | null

  @prop({ ref: () => User, default: null, index: true })
  user: Ref<User> | null

  @prop({ type: Boolean, default: false, index: true })
  marked: boolean

  @prop({ type: String, default: null, maxlength: 1000 })
  remark: string | null

  @prop({ type: String, default: null })
  origin: string | null

  @prop({ type: String, default: null })
  ip: string | null

  @prop({ type: Object, default: null })
  ip_location: Partial<IPLocation> | null

  @prop({ type: String, default: null })
  user_agent: string | null

  @prop({ type: Date, default: Date.now, immutable: true })
  created_at?: Date

  @prop({ type: Date, default: Date.now })
  updated_at?: Date
}

export const FeedbackProvider = getProviderByTypegooseClass(Feedback)
