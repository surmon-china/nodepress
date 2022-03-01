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
  Hate = 1,
  Dislike = 2,
  Neutral = 3,
  Like = 4,
  Love = 5,
}

const emotionMap = new Map(
  [
    {
      value: FeedbackEmotion.Hate,
      text: FeedbackEmotion[FeedbackEmotion.Hate],
      emoji: '😠',
    },
    {
      value: FeedbackEmotion.Dislike,
      text: FeedbackEmotion[FeedbackEmotion.Dislike],
      emoji: '🙁',
    },
    {
      value: FeedbackEmotion.Neutral,
      text: FeedbackEmotion[FeedbackEmotion.Neutral],
      emoji: '😐',
    },
    {
      value: FeedbackEmotion.Like,
      text: FeedbackEmotion[FeedbackEmotion.Like],
      emoji: '😀',
    },
    {
      value: FeedbackEmotion.Love,
      text: FeedbackEmotion[FeedbackEmotion.Love],
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
  @prop({ default: null })
  user_name: null | string

  @IsEmail()
  @IsString()
  @IsOptional()
  @prop({ default: null })
  user_email: null | string
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
  @prop({ default: null })
  origin: null | string

  @IsString()
  @prop({ default: null })
  user_agent?: string

  @IsIP()
  @IsOptional()
  @prop({ default: null })
  ip: null | string

  // IP location
  @prop({ default: null, type: Object })
  ip_location: null | (Partial<IPLocation> & { [key: string]: any })

  @prop({ default: Date.now, immutable: true })
  create_at?: Date

  @prop({ default: Date.now })
  update_at?: Date
}

export const FeedbackProvider = getProviderByTypegooseClass(Feedback)
