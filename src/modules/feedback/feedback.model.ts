/**
 * @file Feedback model
 * @module module/feedback/model
 * @author Surmon <https://github.com/surmon-china>
 */

import { AutoIncrementID } from '@typegoose/auto-increment'
import { prop, plugin, modelOptions, Severity } from '@typegoose/typegoose'
import {
  IsString,
  MinLength,
  MaxLength,
  Min,
  IsIP,
  IsBoolean,
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsNotEmpty,
} from 'class-validator'
import { generalAutoIncrementIDConfig } from '@app/constants/increment.constant'
import { getProviderByTypegooseClass } from '@app/transformers/model.transformer'
import { mongoosePaginate } from '@app/utils/paginate'
import { IPLocation } from '@app/processors/helper/helper.service.ip'

export enum FeedbackEmotion {
  Terrible = 1,
  Bad = 2,
  Neutral = 3,
  Great = 4,
  Amazing = 5,
}

const emotionMap = new Map(
  [
    {
      value: FeedbackEmotion.Terrible,
      text: FeedbackEmotion[FeedbackEmotion.Terrible],
      emoji: '😠',
    },
    {
      value: FeedbackEmotion.Bad,
      text: FeedbackEmotion[FeedbackEmotion.Bad],
      emoji: '🙁',
    },
    {
      value: FeedbackEmotion.Neutral,
      text: FeedbackEmotion[FeedbackEmotion.Neutral],
      emoji: '😐',
    },
    {
      value: FeedbackEmotion.Great,
      text: FeedbackEmotion[FeedbackEmotion.Great],
      emoji: '😃',
    },
    {
      value: FeedbackEmotion.Amazing,
      text: FeedbackEmotion[FeedbackEmotion.Amazing],
      emoji: '🥰',
    },
  ].map((item) => [item.value, item])
)

export const FEEDBACK_EMOTIONS = Array.from(emotionMap.values())
export const FEEDBACK_EMOTION_VALUES = FEEDBACK_EMOTIONS.map((e) => e.value)

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
    return emotionMap.get(this.emotion)!.text
  }

  public get emotion_emoji() {
    return emotionMap.get(this.emotion)!.emoji
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
@plugin(AutoIncrementID, generalAutoIncrementIDConfig)
@modelOptions({
  options: { allowMixed: Severity.ALLOW },
  schemaOptions: {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: {
      createdAt: 'create_at',
      updatedAt: 'update_at',
    },
  },
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
  create_at?: Date

  @prop({ default: Date.now })
  update_at?: Date
}

export const FeedbackProvider = getProviderByTypegooseClass(Feedback)
