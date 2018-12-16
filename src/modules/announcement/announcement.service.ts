
import { Document, Model, PaginateOptions, PaginateResult } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from 'typegoose';
import { Announcement } from './announcement.modal';
import { CreateAnnouncementDto } from './bak/announcement.dto';

interface PaginateModel<T extends Document> extends Model<T> {
  paginate(
    query?: object,
    options?: PaginateOptions,
  );
}

type test<T> = Model<T & Document> & T;

@Injectable()
export class AnnouncementService {
  constructor(@InjectModel(Announcement) private readonly announcementModel: test<Announcement>) {}

  async findAll(query, options): Promise<Announcement[]> {
    return await (this.announcementModel as any).paginate(query, options);
  }

  async create(createAnnouncementDto: CreateAnnouncementDto): Promise<Announcement> {
    const createdAnnouncement = new this.announcementModel(createAnnouncementDto);
    return await createdAnnouncement.save();
  }
}