import { KeywordQueryDTO, BooleanNumberValue } from '@app/models/query.model';
import { PaginateOptionDTO } from '@app/models/paginate.model';
declare const FeedbackPaginateQueryDTO_base: import("@nestjs/mapped-types").MappedType<PaginateOptionDTO & KeywordQueryDTO>;
export declare class FeedbackPaginateQueryDTO extends FeedbackPaginateQueryDTO_base {
    tid?: number;
    emotion?: number;
    marked?: BooleanNumberValue.True | BooleanNumberValue.False;
}
export declare class FeedbacksDTO {
    feedback_ids: string[];
}
export {};
