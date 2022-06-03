/**
 * @file Announcement service
 * @module module/announcement/service
 * @author Surmon <https://github.com/surmon-china>
 */

import { Injectable } from '@nestjs/common'
import { InjectModel } from '@app/transformers/model.transformer'
import { MongooseModel, MongooseDoc, MongooseID } from '@app/interfaces/mongoose.interface'
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

  public update(announcementID: MongooseID, announcement: Announcement): Promise<MongooseDoc<Announcement>> {
    return this.announcementModel
      .findByIdAndUpdate(announcementID, announcement, { new: true })
      .exec()
      .then((result) => result || Promise.reject(`Announcement '${announcementID}' not found`))
  }

  public delete(announcementID: MongooseID): Promise<MongooseDoc<Announcement>> {
    return this.announcementModel
      .findByIdAndRemove(announcementID)
      .exec()
      .then((result) => result || Promise.reject(`Announcement '${announcementID}' not found`))
  }

  public batchDelete(announcementIDs: MongooseID[]) {
    return this.announcementModel.deleteMany({ _id: { $in: announcementIDs } }).exec()
  }
}
