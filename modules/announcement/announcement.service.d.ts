import { Types } from 'mongoose';
import { MongooseModel } from '@app/interfaces/mongoose.interface';
import { PaginateResult, PaginateOptions } from '@app/utils/paginate';
import { Announcement } from './announcement.model';
export declare class AnnouncementService {
    private readonly announcementModel;
    constructor(announcementModel: MongooseModel<Announcement>);
    getList(querys: any, options: PaginateOptions): Promise<PaginateResult<Announcement>>;
    create(announcement: Announcement): Promise<Announcement>;
    update(announcementID: Types.ObjectId, announcement: Announcement): Promise<import("mongoose").Document<any, import("@typegoose/typegoose/lib/types").BeAnObject, any> & Announcement & import("@typegoose/typegoose/lib/types").IObjectWithTypegooseFunction & {
        _id: any;
    }>;
    delete(announcementID: Types.ObjectId): Promise<Announcement>;
    batchDelete(announcementIDs: Types.ObjectId[]): Promise<import("mongodb").DeleteResult>;
}
