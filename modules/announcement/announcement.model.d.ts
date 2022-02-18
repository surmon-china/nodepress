import { PublishState } from '@app/constants/biz.constant';
export declare const ANNOUNCEMENT_STATES: readonly [PublishState.Draft, PublishState.Published];
export declare class Announcement {
    id: number;
    content: string;
    state: PublishState;
    create_at?: Date;
    update_at?: Date;
}
export declare const AnnouncementProvider: import("@nestjs/common").Provider<any>;
