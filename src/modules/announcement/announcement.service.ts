
import { PaginateResult } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { TMongooseModel } from '@app/interfaces/mongoose.interface';
import { Announcement } from './announcement.modal';

@Injectable()
export class AnnouncementService {
  constructor(@InjectModel(Announcement) private readonly announcementModel: TMongooseModel<Announcement>) {}

  async findAll(querys, options): Promise<PaginateResult<Announcement>> {
    return await this.announcementModel.paginate(querys, options);
  }

  async create(createAnnouncementDto: Announcement): Promise<Announcement> {
    const createdAnnouncement = new this.announcementModel(createAnnouncementDto);
    return await createdAnnouncement.save();
  }
}