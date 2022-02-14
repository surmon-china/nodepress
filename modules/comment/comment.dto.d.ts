import { CommentState } from '@app/interfaces/biz.interface';
import { KeywordQueryDTO } from '@app/models/query.model';
import { PaginateOptionWithHotSortDTO } from '@app/models/paginate.model';
declare const CommentPaginateQueryDTO_base: import("@nestjs/mapped-types").MappedType<PaginateOptionWithHotSortDTO & KeywordQueryDTO>;
export declare class CommentPaginateQueryDTO extends CommentPaginateQueryDTO_base {
    state?: CommentState;
    post_id?: number;
}
export declare class CommentsDTO {
    comment_ids: string[];
    post_ids: number[];
}
export declare class CommentsStateDTO extends CommentsDTO {
    state: CommentState;
}
export {};
