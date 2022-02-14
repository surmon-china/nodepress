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

  // 请求公告列表
  public paginater(
    query: PaginateQuery<Announcement>,
    options: PaginateOptions
  ): Promise<PaginateResult<Announcement>> {
    return this.announcementModel.paginate(query, options)
  }

  // 创建公告
  public create(announcement: Announcement): Promise<MongooseDoc<Announcement>> {
    return this.announcementModel.create(announcement)
  }

  // 修改单个公告
  public update(announcementID: MongooseID, announcement: Announcement): Promise<MongooseDoc<Announcement>> {
    return this.announcementModel
      .findByIdAndUpdate(announcementID, announcement, { new: true })
      .exec()
      .then((result) => result || Promise.reject(`Announcement '${announcementID}' not found`))
  }

  // 删除单个公告
  public delete(announcementID: MongooseID): Promise<MongooseDoc<Announcement>> {
    return this.announcementModel
      .findByIdAndRemove(announcementID)
      .exec()
      .then((result) => result || Promise.reject(`Announcement '${announcementID}' not found`))
  }

  // 批量删除公告
  public batchDelete(announcementIDs: MongooseID[]) {
    return this.announcementModel.deleteMany({ _id: { $in: announcementIDs } }).exec()
  }
}
