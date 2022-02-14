/**
 * @file Announcement model
 * @module module/announcement/model
 * @author Surmon <https://github.com/surmon-china>
 */

import { AutoIncrementID } from '@typegoose/auto-increment'
import { prop, plugin, modelOptions } from '@typegoose/typegoose'
import { IsString, IsInt, IsIn, IsDefined, IsNotEmpty } from 'class-validator'
import { generalAutoIncrementIDConfig } from '@app/constants/increment.constant'
import { getProviderByTypegooseClass } from '@app/transformers/model.transformer'
import { mongoosePaginate } from '@app/utils/paginate'
import { PublishState } from '@app/interfaces/biz.interface'

export const ANNOUNCEMENT_STATES = [PublishState.Draft, PublishState.Published] as const

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

  @IsString()
  @IsNotEmpty({ message: 'content?' })
  @prop({ required: true, validate: /\S+/ })
  content: string

  @IsIn(ANNOUNCEMENT_STATES)
  @IsInt()
  @IsDefined()
  @prop({ enum: PublishState, default: PublishState.Published, index: true })
  state: PublishState

  @prop({ default: Date.now, immutable: true })
  create_at?: Date

  @prop({ default: Date.now })
  update_at?: Date
}

export const AnnouncementProvider = getProviderByTypegooseClass(Announcement)
