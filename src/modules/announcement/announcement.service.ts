/**
 * Announcement service.
 * @file 公告模块数据服务
 * @module module/announcement/service
 * @author Surmon <https://github.com/surmon-china>
 */

import { PaginateResult, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { TMongooseModel } from '@app/interfaces/mongoose.interface';
import { Announcement } from './announcement.model';

@Injectable()
export class AnnouncementService {
  constructor(@InjectModel(Announcement) private readonly announcementModel: TMongooseModel<Announcement>) {}

  // 请求公告列表
  getList(querys, options): Promise<PaginateResult<Announcement>> {
    return this.announcementModel.paginate(querys, options);
  }

  // 创建公告
  createItem(announcement: Announcement): Promise<Announcement> {
    return new this.announcementModel(announcement).save();
  }

  // 修改公告
  async putItem(announcementId: Types.ObjectId, announcement: Announcement): Promise<Announcement> {
    return this.announcementModel.findByIdAndUpdate(announcementId, announcement, { new: true });
  }

  // 删除单个公告
  async deleteItem(announcementId: Types.ObjectId): Promise<any> {
    return this.announcementModel.findByIdAndRemove(announcementId);
  }

  // 批量删除公告
  async deleteList(announcementIds: Types.ObjectId[]): Promise<any> {
    return this.announcementModel.deleteMany({ _id: { $in: announcementIds }});
  }
}
