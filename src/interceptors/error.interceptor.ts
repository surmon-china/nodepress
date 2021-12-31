/**
 * @file Error interceptor
 * @module interceptor/error
 * @author Surmon <https://github.com/surmon-china>
 */

import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { Reflector } from '@nestjs/core'
import { Injectable, NestInterceptor, CallHandler, ExecutionContext, HttpStatus } from '@nestjs/common'
import { ResponseMessage } from '@app/interfaces/http.interface'
import { CustomError } from '@app/errors/custom.error'
import * as META from '@app/constants/meta.constant'
import * as TEXT from '@app/constants/text.constant'

/**
 * @class ErrorInterceptor
 * @classdesc catch error when controller Promise rejected
 */
@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    const call$ = next.handle()
    const target = context.getHandler()
    const statusCode = this.reflector.get<HttpStatus>(META.HTTP_ERROR_CODE, target)
    const message = this.reflector.get<ResponseMessage>(META.HTTP_ERROR_MESSAGE, target)
    return call$.pipe(
      catchError((error) => {
        return throwError(
          () => new CustomError({ message: message || TEXT.HTTP_DEFAULT_ERROR_TEXT, error }, statusCode)
        )
      })
    )
  }
}
