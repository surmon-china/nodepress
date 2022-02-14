import { MongooseModel, MongooseDoc, MongooseID } from '@app/interfaces/mongoose.interface';
import { PaginateResult, PaginateOptions, PaginateQuery } from '@app/utils/paginate';
import { Announcement } from './announcement.model';
export declare class AnnouncementService {
    private readonly announcementModel;
    constructor(announcementModel: MongooseModel<Announcement>);
    paginater(query: PaginateQuery<Announcement>, options: PaginateOptions): Promise<PaginateResult<Announcement>>;
    create(announcement: Announcement): Promise<MongooseDoc<Announcement>>;
    update(announcementID: MongooseID, announcement: Announcement): Promise<MongooseDoc<Announcement>>;
    delete(announcementID: MongooseID): Promise<MongooseDoc<Announcement>>;
    batchDelete(announcementIDs: MongooseID[]): Promise<import("mongodb").DeleteResult>;
}
