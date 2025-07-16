/**
 * @file Announcement service
 * @module module/announcement/service
 * @author Surmon <https://github.com/surmon-china>
 */

import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@app/transformers/model.transformer'
import { MongooseModel, MongooseDoc, MongooseId } from '@app/interfaces/mongoose.interface'
import { PaginateResult, PaginateOptions, PaginateQuery } from '@app/utils/paginate'
import { Announcement } from './announcement.model'

@Injectable()
export class AnnouncementService {
  constructor(@InjectModel(Announcement) private readonly announcementModel: MongooseModel<Announcement>) {}

  public paginate(
    query: PaginateQuery<Announcement>,
    options: PaginateOptions
  ): Promise<PaginateResult<Announcement>> {
    return this.announcementModel.paginate(query, options)
  }

  public create(announcement: Announcement): Promise<MongooseDoc<Announcement>> {
    return this.announcementModel.create(announcement)
  }

  public async update(announcementId: MongooseId, announcement: Announcement): Promise<MongooseDoc<Announcement>> {
    const updated = await this.announcementModel
      .findByIdAndUpdate(announcementId, announcement, { new: true })
      .exec()

    if (!updated) {
      throw new NotFoundException(`Announcement '${announcementId}' not found`)
    }
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
