/**
 * @file Announcement model
 * @module module/announcement/model
 * @author Surmon <https://github.com/surmon-china>
 */

import { Types } from 'mongoose'
import { AutoIncrementID } from '@typegoose/auto-increment'
import { prop, plugin, modelOptions } from '@typegoose/typegoose'
import { IsString, IsInt, IsIn, IsDefined, IsNotEmpty, IsArray, ArrayNotEmpty, ArrayUnique } from 'class-validator'
import { mongoosePaginate } from '@app/transformers/mongoose.transformer'
import { getProviderByTypegooseClass } from '@app/transformers/model.transformer'
import { PublishState } from '@app/interfaces/biz.interface'

@plugin(mongoosePaginate)
@plugin(AutoIncrementID, { field: 'id', startAt: 1 })
@modelOptions({
  schemaOptions: {
    timestamps: {
      createdAt: 'create_at',
      updatedAt: 'update_at',
    },
  },
})
export class Announcement {
  @prop({ unique: true })
  id: number

  @IsNotEmpty({ message: '内容？' })
  @IsString({ message: '字符串？' })
  @prop({ required: true, validate: /\S+/ })
  content: string

  @IsDefined()
  @IsIn([PublishState.Draft, PublishState.Published])
  @IsInt({ message: '数字？' })
  @prop({ enum: PublishState, default: PublishState.Published, index: true })
  state: PublishState

  @prop({ default: Date.now, immutable: true })
  create_at?: Date

  @prop({ default: Date.now })
  update_at?: Date
}

export class AnnouncementsPayload {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  announcement_ids: Types.ObjectId[]
}

export const AnnouncementProvider = getProviderByTypegooseClass(Announcement)
