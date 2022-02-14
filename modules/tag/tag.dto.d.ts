import { PaginateOptionDTO } from '@app/models/paginate.model';
import { KeywordQueryDTO } from '@app/models/query.model';
declare const TagPaginateQueryDTO_base: import("@nestjs/mapped-types").MappedType<PaginateOptionDTO & KeywordQueryDTO>;
export declare class TagPaginateQueryDTO extends TagPaginateQueryDTO_base {
}
export declare class TagsDTO {
    tag_ids: string[];
}
export {};
