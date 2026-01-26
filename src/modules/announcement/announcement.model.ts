/**
 * @file Announcement model
 * @module module/announcement/model
 * @author Surmon <https://github.com/surmon-china>
 */

import { AutoIncrementID } from '@typegoose/auto-increment'
import { prop, plugin, modelOptions } from '@typegoose/typegoose'
import { IsString, IsInt, IsIn, IsDefined, IsNotEmpty } from 'class-validator'
import { GENERAL_DB_AUTO_INCREMENT_ID_CONFIG } from '@app/constants/database.constant'
import { getProviderByTypegooseClass } from '@app/transformers/model.transformer'
import { mongoosePaginate } from '@app/utils/paginate'
import { AnnouncementStatus, ANNOUNCEMENT_STATUSES } from './announcement.constant'

@plugin(mongoosePaginate)
@plugin(AutoIncrementID, GENERAL_DB_AUTO_INCREMENT_ID_CONFIG)
@modelOptions({
  schemaOptions: {
    id: false,
    versionKey: false,
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
})
export class Announcement {
  @prop({ unique: true })
  id: number

  @IsString()
  @IsNotEmpty({ message: 'content?' })
  @prop({ required: true, validate: /\S+/ })
  content: string

  @IsIn(ANNOUNCEMENT_STATUSES)
  @IsInt()
  @IsDefined()
  @prop({ enum: AnnouncementStatus, default: AnnouncementStatus.Published, index: true })
  status: AnnouncementStatus

  @prop({ default: Date.now, immutable: true })
  created_at?: Date

  @prop({ default: Date.now })
  updated_at?: Date
}

export const AnnouncementProvider = getProviderByTypegooseClass(Announcement)
