import { QueryParamsResult } from '@app/decorators/queryparams.decorator';
import { PaginateResult } from '@app/utils/paginate';
import { AnnouncementsDTO, AnnouncementPaginateQueryDTO } from './announcement.dto';
import { AnnouncementService } from './announcement.service';
import { Announcement } from './announcement.model';
export declare class AnnouncementController {
    private readonly announcementService;
    constructor(announcementService: AnnouncementService);
    getAnnouncements(query: AnnouncementPaginateQueryDTO): Promise<PaginateResult<Announcement>>;
    createAnnouncement(announcement: Announcement): Promise<import("../../interfaces/mongoose.interface").MongooseDoc<Announcement>>;
    delAnnouncements(body: AnnouncementsDTO): Promise<import("mongodb").DeleteResult>;
    putAnnouncement({ params }: QueryParamsResult, announcement: Announcement): Promise<import("../../interfaces/mongoose.interface").MongooseDoc<Announcement>>;
    delAnnouncement({ params }: QueryParamsResult): Promise<import("../../interfaces/mongoose.interface").MongooseDoc<Announcement>>;
}
