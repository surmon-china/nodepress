import { Request } from 'express';
export interface QueryVisitor {
    ip: string;
    ua?: string;
    origin?: string;
    referer?: string;
}
export interface QueryCookies {
    [key: string]: string;
}
export interface QueryParamsResult {
    isAuthenticated: boolean;
    isUnauthenticated: boolean;
    params: Record<string, string>;
    query: Record<string, string>;
    cookies: QueryCookies;
    visitor: QueryVisitor;
    request: Request;
}
export declare const QueryParams: (...dataOrPipes: (import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>> | keyof QueryParamsResult)[]) => ParameterDecorator;
