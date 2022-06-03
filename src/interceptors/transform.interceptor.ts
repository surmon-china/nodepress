/**
 * @file Response data transform interceptor
 * @module interceptor/transform
 * @author Surmon <https://github.com/surmon-china>
 */

import { Request } from 'express'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Injectable, NestInterceptor, CallHandler, ExecutionContext } from '@nestjs/common'
import { HttpResponseSuccess, ResponseStatus } from '@app/interfaces/response.interface'
import { getResponserOptions } from '@app/decorators/responser.decorator'
import * as TEXT from '@app/constants/text.constant'

/**
 * @class TransformInterceptor
 * @classdesc transform `T` to `HttpResponseSuccess<T>` when controller `Promise` resolved
 */
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, T | HttpResponseSuccess<T>> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<T | HttpResponseSuccess<T>> {
    const call$ = next.handle()
    const target = context.getHandler()
    const { successMessage, transform, paginate } = getResponserOptions(target)
    if (!transform) {
      return call$
    }

    const request = context.switchToHttp().getRequest<Request>()
    return call$.pipe(
      map((data: any) => {
        return {
          status: ResponseStatus.Success,
          message: successMessage || TEXT.HTTP_DEFAULT_SUCCESS_TEXT,
          params: {
            isAuthenticated: request.isAuthenticated(),
            isUnauthenticated: request.isUnauthenticated(),
            url: request.url,
            method: request.method,
            routes: request.params,
            payload: request.$validatedPayload || {},
          },
          result: paginate
            ? {
                data: data.documents,
                pagination: {
                  total: data.total,
                  current_page: data.page,
                  per_page: data.perPage,
                  total_page: data.totalPage,
                },
              }
            : data,
        }
      })
    )
  }
}
