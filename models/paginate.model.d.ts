import { SortType } from '@app/constants/biz.constant';
export declare class PaginateBaseOptionDTO {
    page?: number;
    per_page?: number;
}
export declare class PaginateOptionDTO extends PaginateBaseOptionDTO {
    sort?: SortType.Asc | SortType.Desc;
}
export declare class PaginateOptionWithHotSortDTO extends PaginateBaseOptionDTO {
    sort?: SortType;
}
