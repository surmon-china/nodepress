import { PublishState, PublicState, OriginState } from '@app/constants/biz.constant';
import { DateQueryDTO, KeywordQueryDTO } from '@app/models/query.model';
import { PaginateOptionWithHotSortDTO } from '@app/models/paginate.model';
declare const ArticlePaginateQueryDTO_base: import("@nestjs/mapped-types").MappedType<PaginateOptionWithHotSortDTO & KeywordQueryDTO & DateQueryDTO>;
export declare class ArticlePaginateQueryDTO extends ArticlePaginateQueryDTO_base {
    state?: PublishState;
    public?: PublicState;
    origin?: OriginState;
    tag_slug?: string;
    category_slug?: string;
    lang: string;
}
export declare class ArticleListQueryDTO {
    count?: number;
}
export declare class ArticleCalendarQueryDTO {
    timezone?: string;
}
export declare class ArticleIDsDTO {
    article_ids: string[];
}
export declare class ArticlesStateDTO extends ArticleIDsDTO {
    state: PublishState;
}
export {};
