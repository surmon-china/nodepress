/**
 * @file Response data transform interceptor
 * @module interceptor/transform
 * @author Surmon <https://github.com/surmon-china>
 */

import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Reflector } from '@nestjs/core'
import { Injectable, NestInterceptor, CallHandler, ExecutionContext } from '@nestjs/common'
import { HttpResponseSuccess, HttpPaginateResult, ResponseStatus } from '@app/interfaces/http.interface'
import { ResponseMessage } from '@app/interfaces/http.interface'
import { PaginateResult } from '@app/utils/paginate'
import * as META from '@app/constants/meta.constant'
import * as TEXT from '@app/constants/text.constant'

// 转换为标准的数据结构
export function transformDataToPaginate<T>(data: PaginateResult<T>, request?: any): HttpPaginateResult<T[]> {
  return {
    data: data.documents,
    params: request?.queryParams || null,
    pagination: {
      total: data.total,
      current_page: data.page,
      per_page: data.perPage,
      total_page: data.totalPage,
    },
  }
}

/**
 * @class TransformInterceptor
 * @classdesc 当控制器所需的 Promise service 成功响应时，将在此被转换为标准的数据结构 IHttpResultPaginate
 */
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, HttpResponseSuccess<T>> {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<HttpResponseSuccess<T>> {
    const call$ = next.handle()
    const target = context.getHandler()
    const request = context.switchToHttp().getRequest()
    const message = this.reflector.get<ResponseMessage>(META.HTTP_SUCCESS_MESSAGE, target)
    const usePaginate = this.reflector.get<boolean>(META.HTTP_RES_TRANSFORM_PAGINATE, target)
    return call$.pipe(
      map((data: any) => {
        return {
          result: usePaginate ? transformDataToPaginate<T>(data, request) : data,
          status: ResponseStatus.Success,
          message: message || TEXT.HTTP_DEFAULT_SUCCESS_TEXT,
        }
      })
    )
  }
}
