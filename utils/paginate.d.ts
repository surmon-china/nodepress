import type { Model, Document, Schema, FilterQuery, QueryOptions } from 'mongoose';
export interface PaginateResult<T> {
    documents: Array<T>;
    total: number;
    page: number;
    perPage: number;
    totalPage: number;
}
export type PaginateQuery<T = any> = FilterQuery<T>;
export interface PaginateOptions {
    page?: number;
    perPage?: number;
    dateSort?: 1 | -1;
    projection?: string | object | null;
    sort?: QueryOptions['sort'];
    lean?: QueryOptions['lean'];
    populate?: QueryOptions['populate'];
    $queryOptions?: QueryOptions;
}
export interface PaginateModel<T extends Document> extends Model<T> {
    paginate(query?: PaginateQuery<T>, options?: PaginateOptions): Promise<PaginateResult<T>>;
}
export declare function mongoosePaginate(schema: Schema): void;
export declare function paginate<T>(this: Model<T>, filterQuery?: PaginateQuery<T>, options?: PaginateOptions): Promise<PaginateResult<T>>;
