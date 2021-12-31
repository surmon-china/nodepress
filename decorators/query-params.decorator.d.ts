import { Types } from 'mongoose';
import { PaginateOptions } from '@app/utils/paginate';
export declare enum QueryParamsField {
    Page = "page",
    PerPage = "per_page",
    Sort = "sort",
    Date = "date",
    Keyword = "keyword",
    State = "state",
    Public = "public",
    Origin = "origin",
    ParamsId = "paramsId",
    CommentState = "commentState"
}
export interface QueryParamsConfig extends Omit<PaginateOptions, 'populate' | 'select'> {
    [key: string]: void | string | number | boolean | Types.ObjectId | Date | RegExp | QueryParamsConfig | any;
}
export interface QueryVisitor {
    ip: string;
    ua: string;
    referer: string;
}
export interface cookies {
    [key: string]: string;
}
export interface QueryParamsResult {
    querys: Partial<QueryParamsConfig>;
    options: Partial<QueryParamsConfig>;
    params: Partial<QueryParamsConfig>;
    origin: Partial<QueryParamsConfig>;
    request: any;
    visitor: QueryVisitor;
    cookies: cookies;
    isAuthenticated: boolean;
}
interface TransformConfigObject {
    [key: string]: string | number | boolean;
}
export declare type TransformConfig = QueryParamsField | string | TransformConfigObject;
export declare const QueryParams: (...dataOrPipes: (import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>> | TransformConfig[])[]) => ParameterDecorator;
export {};
