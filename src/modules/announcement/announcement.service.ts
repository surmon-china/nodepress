
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IAnnouncement } from './announcement.interface';
import { CreateAnnouncementDto } from './announcement.dto';

@Injectable()
export class AnnouncementService {
  constructor(@InjectModel('Announcement') private readonly announcementModel: Model<IAnnouncement>) {}

  async findAll(query, option): Promise<IAnnouncement[]> {
    return await this.announcementModel.paginate(query, option);
  }

  async create(createAnnouncementDto: CreateAnnouncementDto): Promise<IAnnouncement> {
    const createdAnnouncement = new this.announcementModel(createAnnouncementDto);
    return await createdAnnouncement.save();
  }
}