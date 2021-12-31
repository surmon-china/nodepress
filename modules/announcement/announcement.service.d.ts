import { Types } from 'mongoose';
import { MongooseModel } from '@app/interfaces/mongoose.interface';
import { PaginateResult, PaginateOptions } from '@app/utils/paginate';
import { Announcement } from './announcement.model';
export declare class AnnouncementService {
    private readonly announcementModel;
    constructor(announcementModel: MongooseModel<Announcement>);
    paginater(querys: any, options: PaginateOptions): Promise<PaginateResult<Announcement>>;
    create(announcement: Announcement): Promise<Announcement>;
    update(announcementID: Types.ObjectId, announcement: Announcement): Promise<Announcement>;
    delete(announcementID: Types.ObjectId): Promise<Announcement>;
    batchDelete(announcementIDs: Types.ObjectId[]): Promise<import("mongodb").DeleteResult>;
}
