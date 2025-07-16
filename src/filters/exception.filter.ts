/**
 * @file HttpException filter
 * @module filter/error
 * @author Surmon <https://github.com/surmon-china>
 */

import _isString from 'lodash/isString'
import { FastifyReply } from 'fastify'
import type { ArgumentsHost } from '@nestjs/common'
import { ExceptionFilter, Catch, HttpStatus, HttpException } from '@nestjs/common'
import { ResponseStatus, HttpErrorResponse } from '@app/interfaces/response.interface'

type ExceptionResponse =
  | string
  | {
      message: string
      error?: any
    }

/**
 * @class HttpExceptionFilter
 * @classdesc catch globally exceptions & formatting error message to <HttpErrorResponse>
 * @link https://docs.nestjs.com/exception-filters
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp()
    const response = context.getResponse<FastifyReply>()
    const timestamp = new Date().toISOString()

    if (exception instanceof HttpException) {
      const errorInfo = exception.getResponse() as ExceptionResponse
      response.code(exception.getStatus()).send({
        status: ResponseStatus.Error,
        message: _isString(errorInfo) ? errorInfo : errorInfo.message,
        error: _isString(errorInfo) ? null : errorInfo.error,
        timestamp
      } as HttpErrorResponse)
    } else {
      response.code(HttpStatus.INTERNAL_SERVER_ERROR).send({
        status: ResponseStatus.Error,
        message: exception instanceof Error ? exception.message : String(exception),
        error: 'Internal Server Error',
        timestamp
      } as HttpErrorResponse)
    }
  }
}
