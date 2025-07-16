/**
 * @file Response data transform interceptor
 * @module interceptor/transform
 * @author Surmon <https://github.com/surmon-china>
 */

import { map } from 'rxjs/operators'
import type { Observable } from 'rxjs'
import type { FastifyRequest, FastifyReply } from 'fastify'
import type { CallHandler, ExecutionContext } from '@nestjs/common'
import { Injectable, NestInterceptor } from '@nestjs/common'
import { HttpSuccessResponse, ResponseStatus } from '@app/interfaces/response.interface'
import { getSuccessResponseOptions } from '@app/decorators/success-response.decorator'

/**
 * @class TransformInterceptor
 * @classdesc transform `T` to `HttpResponseSuccess<T>` when controller `Promise` resolved
 */
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, T | HttpSuccessResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<T | HttpSuccessResponse<T>> {
    const reponseOptions = getSuccessResponseOptions(context.getHandler())
    if (!reponseOptions.useTransform) {
      return next.handle()
    }

    const request = context.switchToHttp().getRequest<FastifyRequest>()
    const response = context.switchToHttp().getResponse<FastifyReply>()

    return next.handle().pipe(
      map((data: any) => {
        if (reponseOptions.status) {
          response.status(reponseOptions.status)
        }

        const responseBody: HttpSuccessResponse<T> = {
          status: ResponseStatus.Success,
          message: reponseOptions.message ?? 'Success',
          context: {
            url: request.url,
            method: request.method,
            route_params: request.params ?? {},
            query_params: request.locals.validatedQueryParams ?? {},
            is_authenticated: request.locals.isAuthenticated,
            is_unauthenticated: request.locals.isUnauthenticated
          },
          result: !reponseOptions.usePaginate
            ? data
            : {
                data: data.documents,
                pagination: {
                  total: data.total,
                  current_page: data.page,
                  per_page: data.perPage,
                  total_page: data.totalPage
                }
              }
        }

        return responseBody
      })
    )
  }
}
