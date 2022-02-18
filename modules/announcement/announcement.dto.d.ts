import { PublishState } from '@app/constants/biz.constant';
import { PaginateOptionDTO } from '@app/models/paginate.model';
import { KeywordQueryDTO } from '@app/models/query.model';
declare const AnnouncementPaginateQueryDTO_base: import("@nestjs/mapped-types").MappedType<PaginateOptionDTO & KeywordQueryDTO>;
export declare class AnnouncementPaginateQueryDTO extends AnnouncementPaginateQueryDTO_base {
    state?: PublishState;
}
export declare class AnnouncementsDTO {
    announcement_ids: string[];
}
export {};
