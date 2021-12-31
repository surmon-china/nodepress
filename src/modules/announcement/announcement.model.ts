/**
 * @file Announcement model
 * @module module/announcement/model
 * @author Surmon <https://github.com/surmon-china>
 */

import { Types } from 'mongoose'
import { AutoIncrementID } from '@typegoose/auto-increment'
import { prop, plugin, modelOptions } from '@typegoose/typegoose'
import { IsString, IsInt, IsIn, IsDefined, IsNotEmpty, IsArray, ArrayNotEmpty, ArrayUnique } from 'class-validator'
import { generalAutoIncrementIDConfig } from '@app/constants/increment.constant'
import { getProviderByTypegooseClass } from '@app/transformers/model.transformer'
import { mongoosePaginate } from '@app/utils/paginate'
import { PublishState } from '@app/interfaces/biz.interface'

@plugin(mongoosePaginate)
@plugin(AutoIncrementID, generalAutoIncrementIDConfig)
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

  @IsNotEmpty({ message: 'content?' })
  @IsString({ message: 'string?' })
  @prop({ required: true, validate: /\S+/ })
  content: string

  @IsDefined()
  @IsIn([PublishState.Draft, PublishState.Published])
  @IsInt({ message: 'PublishState?' })
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
