/**
 * @file Announcement service
 * @module module/announcement/service
 * @author Surmon <https://github.com/surmon-china>
 */

import { Injectable } from '@nestjs/common'
import { InjectModel } from '@app/transformers/model.transformer'
import { MongooseModel, MongooseDoc, MongooseId } from '@app/interfaces/mongoose.interface'
import { PaginateResult, PaginateOptions, PaginateQuery } from '@app/utils/paginate'
import { Announcement } from './announcement.model'

@Injectable()
export class AnnouncementService {
  constructor(@InjectModel(Announcement) private readonly announcementModel: MongooseModel<Announcement>) {}

  public paginator(
    query: PaginateQuery<Announcement>,
    options: PaginateOptions
  ): Promise<PaginateResult<Announcement>> {
    return this.announcementModel.paginate(query, options)
  }

  public create(announcement: Announcement): Promise<MongooseDoc<Announcement>> {
    return this.announcementModel.create(announcement)
  }

  public update(announcementId: MongooseId, announcement: Announcement): Promise<MongooseDoc<Announcement>> {
    return this.announcementModel
      .findByIdAndUpdate(announcementId, announcement, { new: true })
      .exec()
      .then((result) => result || Promise.reject(`Announcement '${announcementId}' not found`))
  }

  public delete(announcementId: MongooseId) {
    return this.announcementModel
      .findByIdAndDelete(announcementId, null)
      .exec()
      .then((result) => {
        return result ?? Promise.reject(`Announcement '${announcementId}' not found`)
      })
  }

  public batchDelete(announcementIds: MongooseId[]) {
    return this.announcementModel.deleteMany({ _id: { $in: announcementIds } }).exec()
  }
}
