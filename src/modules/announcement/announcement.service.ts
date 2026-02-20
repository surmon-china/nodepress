/**
 * @file Announcement service
 * @module module/announcement/service
 * @author Surmon <https://github.com/surmon-china>
 */

import type { QueryFilter } from 'mongoose'
import { Injectable, NotFoundException } from '@nestjs/common'
import { MongooseModel, MongooseDoc } from '@app/interfaces/mongoose.interface'
import { InjectModel } from '@app/transformers/model.transformer'
import { PaginateOptions } from '@app/utils/paginate'
import { Announcement } from './announcement.model'
import { CreateAnnouncementDto, UpdateAnnouncementDto } from './announcement.dto'

@Injectable()
export class AnnouncementService {
  constructor(@InjectModel(Announcement) private readonly announcementModel: MongooseModel<Announcement>) {}

  public paginate(filter: QueryFilter<Announcement>, options: PaginateOptions) {
    return this.announcementModel.paginateRaw(filter, options)
  }

  public create(input: CreateAnnouncementDto): Promise<MongooseDoc<Announcement>> {
    return this.announcementModel.create(input)
  }

  public async update(announcementId: number, input: UpdateAnnouncementDto): Promise<MongooseDoc<Announcement>> {
    const updated = await this.announcementModel
      .findOneAndUpdate({ id: announcementId }, { $set: input }, { returnDocument: 'after' })
      .exec()
    if (!updated) throw new NotFoundException(`Announcement '${announcementId}' not found`)
    return updated
  }

  public async delete(announcementId: number): Promise<MongooseDoc<Announcement>> {
    const deleted = await this.announcementModel.findOneAndDelete({ id: announcementId }).exec()
    if (!deleted) throw new NotFoundException(`Announcement '${announcementId}' not found`)
    return deleted
  }

  public batchDelete(announcementIds: number[]) {
    return this.announcementModel.deleteMany({ id: { $in: announcementIds } }).exec()
  }
}
