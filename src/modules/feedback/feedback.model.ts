/**
 * @file Feedback model
 * @module module/feedback/model
 * @author Surmon <https://github.com/surmon-china>
 */

import { AutoIncrementID } from '@typegoose/auto-increment'
import { prop, plugin, modelOptions, Severity } from '@typegoose/typegoose'
import { IsString, IsBoolean, IsEmail, IsInt, IsIP, Min, MinLength, MaxLength } from 'class-validator'
import { IsOptional, IsNotEmpty, IsIn } from 'class-validator'
import { GENERAL_DB_AUTO_INCREMENT_ID_CONFIG } from '@app/constants/database.constant'
import { getProviderByTypegooseClass } from '@app/transformers/model.transformer'
import { mongoosePaginate } from '@app/utils/paginate'
import { IPLocation } from '@app/core/helper/helper.service.ip'
import { emotionsMap, FEEDBACK_EMOTION_VALUES } from './feedback.constant'

export class FeedbackBase {
  @Min(0)
  @IsInt()
  @IsNotEmpty()
  @prop({ required: true, index: true })
  tid: number

  @IsIn(FEEDBACK_EMOTION_VALUES)
  @IsInt()
  @IsNotEmpty()
  @prop({ required: true, index: true })
  emotion: number

  public get emotion_text() {
    return emotionsMap.get(this.emotion)!.text
  }

  public get emotion_emoji() {
    return emotionsMap.get(this.emotion)!.emoji
  }

  @MinLength(3)
  @MaxLength(3000)
  @IsString()
  @IsNotEmpty()
  @prop({ required: true, validate: /\S+/ })
  content: string

  @MaxLength(20)
  @IsString()
  @IsOptional()
  @prop({ type: String, default: null })
  user_name: string | null

  @IsEmail()
  @IsString()
  @IsOptional()
  @prop({ type: String, default: null })
  user_email: string | null
}

@plugin(mongoosePaginate)
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
export class Feedback extends FeedbackBase {
  @prop({ unique: true })
  id: number

  @IsBoolean()
  @prop({ default: false, index: true })
  marked: boolean

  @IsString()
  @IsOptional()
  @prop({ default: '' })
  remark: string

  @IsString()
  @IsOptional()
  @prop({ type: String, default: null })
  origin: string | null

  @IsString()
  @prop({ default: null })
  user_agent?: string

  @IsIP()
  @IsOptional()
  @prop({ type: String, default: null })
  ip: null | string

  @prop({ type: Object, default: null })
  ip_location: Partial<IPLocation> | null

  @prop({ default: Date.now, immutable: true })
  created_at?: Date

  @prop({ default: Date.now })
  updated_at?: Date
}

export const FeedbackProvider = getProviderByTypegooseClass(Feedback)
