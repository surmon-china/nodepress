import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { NestInterceptor, CallHandler, ExecutionContext } from '@nestjs/common';
import { HttpResponseSuccess, HttpPaginateResult } from '@app/interfaces/http.interface';
import { PaginateResult } from '@app/utils/paginate';
export declare function transformDataToPaginate<T>(data: PaginateResult<T>, request?: any): HttpPaginateResult<T[]>;
export declare class TransformInterceptor<T> implements NestInterceptor<T, HttpResponseSuccess<T>> {
    private readonly reflector;
    constructor(reflector: Reflector);
    intercept(context: ExecutionContext, next: CallHandler<T>): Observable<HttpResponseSuccess<T>>;
}
