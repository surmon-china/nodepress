/**
 * @file Announcement service
 * @module module/announcement/service
 * @author Surmon <https://github.com/surmon-china>
 */

import type { QueryFilter } from 'mongoose'
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@app/transformers/model.transformer'
import { MongooseModel, MongooseDoc, MongooseId } from '@app/interfaces/mongoose.interface'
import type { PaginateOptions } from '@app/utils/paginate'
import { Announcement } from './announcement.model'

@Injectable()
export class AnnouncementService {
  constructor(@InjectModel(Announcement) private readonly announcementModel: MongooseModel<Announcement>) {}

  public paginate(filter: QueryFilter<Announcement>, options: PaginateOptions) {
    return this.announcementModel.paginateRaw(filter, options)
  }

  public create(announcement: Announcement): Promise<MongooseDoc<Announcement>> {
    return this.announcementModel.create(announcement)
  }

  public async update(announcementId: MongooseId, announcement: Announcement): Promise<MongooseDoc<Announcement>> {
    const updated = await this.announcementModel
      .findByIdAndUpdate(announcementId, announcement, { new: true })
      .exec()
    if (!updated) throw new NotFoundException(`Announcement '${announcementId}' not found`)
    return updated
  }

  public async delete(announcementId: MongooseId): Promise<MongooseDoc<Announcement>> {
    const deleted = await this.announcementModel.findByIdAndDelete(announcementId).exec()
    if (!deleted) throw new NotFoundException(`Announcement '${announcementId}' not found`)
    return deleted
  }

  public batchDelete(announcementIds: MongooseId[]) {
    return this.announcementModel.deleteMany({ _id: { $in: announcementIds } }).exec()
  }
}
