/**
 * @file Announcement model
 * @module module/announcement/model
 * @author Surmon <https://github.com/surmon-china>
 */

import { IsString, IsOptional, IsNotEmpty, IsEnum } from 'class-validator'
import { AutoIncrementID } from '@typegoose/auto-increment'
import { prop, index, plugin, modelOptions } from '@typegoose/typegoose'
import { NormalizeString } from '@app/decorators/normalize-string.decorator'
import { GENERAL_DB_AUTO_INCREMENT_ID_CONFIG } from '@app/constants/database.constant'
import { getProviderByTypegooseClass } from '@app/transformers/model.transformer'
import { mongoosePaginate } from '@app/utils/paginate'
import { AnnouncementStatus } from './announcement.constant'

@plugin(mongoosePaginate)
@plugin(AutoIncrementID, GENERAL_DB_AUTO_INCREMENT_ID_CONFIG)
@index({ status: 1, created_at: -1 })
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
  @IsNotEmpty()
  @NormalizeString({ trim: true })
  @prop({ type: String, required: true, trim: true, validate: /\S+/ })
  content: string

  @IsEnum(AnnouncementStatus)
  @IsOptional()
  @prop({ type: Number, enum: AnnouncementStatus, default: AnnouncementStatus.Published, index: true })
  status: AnnouncementStatus

  @prop({ type: Date, default: Date.now, immutable: true })
  created_at?: Date

  @prop({ type: Date, default: Date.now })
  updated_at?: Date
}

export const AnnouncementProvider = getProviderByTypegooseClass(Announcement)
