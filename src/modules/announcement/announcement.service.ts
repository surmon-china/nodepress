
import { PaginateResult, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { TMongooseModel } from '@app/interfaces/mongoose.interface';
import { Announcement } from './announcement.modal';

@Injectable()
export class AnnouncementService {
  constructor(@InjectModel(Announcement) private readonly announcementModel: TMongooseModel<Announcement>) {}

  // 请求公告列表
  async getList(querys, options): Promise<PaginateResult<Announcement>> {
    return await this.announcementModel.paginate(querys, options);
  }

  // 创建公告
  async createItem(announcement: Announcement): Promise<Announcement> {
    const createdAnnouncement = new this.announcementModel(announcement);
    return await createdAnnouncement.save();
  }

  // 修改公告
  async putItem(announcementId: Types.ObjectId, announcement: Announcement): Promise<Announcement> {
    return await this.announcementModel.findByIdAndUpdate(announcementId, announcement, { new: true });
  }

  // 删除单个公告
  async deleteItem(announcementId: Types.ObjectId): Promise<Announcement> {
    return await this.announcementModel.findByIdAndRemove(announcementId);
  }

  // 删除单个公告
  async deleteList(announcementIds: Types.ObjectId[]): Promise<any> {
    return await this.announcementModel.deleteMany({ _id: { $in: announcementIds }});
  }
}