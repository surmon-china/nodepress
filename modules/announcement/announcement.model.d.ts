import { Types } from 'mongoose';
import { PublishState } from '@app/interfaces/biz.interface';
export declare class Announcement {
    id: number;
    content: string;
    state: PublishState;
    create_at?: Date;
    update_at?: Date;
}
export declare class AnnouncementsPayload {
    announcement_ids: Types.ObjectId[];
}
export declare const AnnouncementProvider: import("@nestjs/common").Provider<any>;
