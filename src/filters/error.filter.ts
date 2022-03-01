/**
 * @file HttpException filter
 * @module filter/error
 * @author Surmon <https://github.com/surmon-china>
 */

import lodash from 'lodash'
import { ExceptionFilter, Catch, HttpException, ArgumentsHost, HttpStatus } from '@nestjs/common'
import { ResponseStatus, HttpResponseError, ExceptionInfo } from '@app/interfaces/response.interface'
import { UNDEFINED } from '@app/constants/value.constant'
import { isDevEnv } from '@app/app.environment'

/**
 * @class HttpExceptionFilter
 * @classdesc 拦截全局抛出的所有异常，同时任何错误将在这里被规范化输出 HttpErrorResponse
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const request = host.switchToHttp().getRequest()
    const response = host.switchToHttp().getResponse()
    const exceptionStatus = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR
    const errorResponse: ExceptionInfo = exception.getResponse() as ExceptionInfo
    const errorMessage = lodash.isString(errorResponse) ? errorResponse : errorResponse.message
    const errorInfo = lodash.isString(errorResponse) ? null : errorResponse.error

    const data: HttpResponseError = {
      status: ResponseStatus.Error,
      message: errorMessage,
      error: errorInfo?.message || (lodash.isString(errorInfo) ? errorInfo : JSON.stringify(errorInfo)),
      debug: isDevEnv ? errorInfo?.stack || exception.stack : UNDEFINED,
    }

    // default 404
    if (exceptionStatus === HttpStatus.NOT_FOUND) {
      data.error = data.error || `Not found`
      data.message = data.message || `Invalid API: ${request.method} > ${request.url}`
    }

    return response.status(errorInfo?.status || exceptionStatus).jsonp(data)
  }
}
