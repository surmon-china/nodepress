/**
 * Transform interceptor.
 * @file 请求流拦截器
 * @module interceptor/transform
 * @author Surmon <https://github.com/surmon-china>
 */

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginateResult } from 'mongoose';
import { Reflector } from '@nestjs/core';
import { Injectable, NestInterceptor, CallHandler, ExecutionContext } from '@nestjs/common';
import { THttpSuccessResponse, IHttpResultPaginate, EHttpStatus } from '@app/interfaces/http.interface';
import { TMessage } from '@app/interfaces/http.interface';
import * as META from '@app/constants/meta.constant';
import * as TEXT from '@app/constants/text.constant';

// 转换为标准的数据结构
export function transformDataToPaginate<T>(data: PaginateResult<T>, request?: any): IHttpResultPaginate<T[]> {
  return {
    data: data.docs,
    params: request ? request.queryParams : null,
    pagination: {
      total: data.total,
      current_page: data.page,
      total_page: data.pages,
      per_page: data.limit,
    },
  };
}

/**
 * @class TransformInterceptor
 * @classdesc 当控制器所需的 Promise service 成功响应时，将在此被转换为标准的数据结构 IHttpResultPaginate
 */
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, THttpSuccessResponse<T>> {

  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<THttpSuccessResponse<T>> {
    const call$ = next.handle();
    const target = context.getHandler();
    const request = context.switchToHttp().getRequest();
    const message = this.reflector.get<TMessage>(META.HTTP_SUCCESS_MESSAGE, target) || TEXT.HTTP_DEFAULT_SUCCESS_TEXT;
    const usePaginate = this.reflector.get<boolean>(META.HTTP_RES_TRANSFORM_PAGINATE, target);
    return call$.pipe(map((data: any) => {
      const result = !usePaginate ? data : transformDataToPaginate<T>(data, request);
      return { status: EHttpStatus.Success, message, result };
    }));
  }
}
