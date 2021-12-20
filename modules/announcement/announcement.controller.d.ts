import { PaginateResult } from '@app/utils/paginate';
import { Announcement, AnnouncementsPayload } from './announcement.model';
import { AnnouncementService } from './announcement.service';
export declare class AnnouncementController {
    private readonly announcementService;
    constructor(announcementService: AnnouncementService);
    getAnnouncements({ querys, options, origin }: {
        querys: any;
        options: any;
        origin: any;
    }): Promise<PaginateResult<Announcement>>;
    createAnnouncement(announcement: Announcement): Promise<Announcement>;
    delAnnouncements(body: AnnouncementsPayload): Promise<import("mongodb").DeleteResult>;
    putAnnouncement({ params }: {
        params: any;
    }, announcement: Announcement): Promise<Announcement>;
    delAnnouncement({ params }: {
        params: any;
    }): Promise<Announcement>;
}
