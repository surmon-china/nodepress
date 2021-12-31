/**
 * @file HttpException filter
 * @module filter/error
 * @author Surmon <https://github.com/surmon-china>
 */

import lodash from 'lodash'
import { ExceptionFilter, Catch, HttpException, ArgumentsHost, HttpStatus } from '@nestjs/common'
import { ResponseStatus, HttpResponseError, ExceptionOption, ResponseMessage } from '@app/interfaces/http.interface'
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
    const status = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR
    const errorOption: ExceptionOption = exception.getResponse() as ExceptionOption
    const isString = (value): value is ResponseMessage => lodash.isString(value)
    const errorInfo = isString(errorOption) ? null : errorOption.error

    const data: HttpResponseError = {
      status: ResponseStatus.Error,
      message: isString(errorOption) ? errorOption : errorOption.message,
      error: errorInfo.message || (isString(errorInfo) ? errorInfo : JSON.stringify(errorInfo)),
      debug: isDevEnv ? exception.stack : UNDEFINED,
    }

    // default 404
    if (status === HttpStatus.NOT_FOUND) {
      data.error = data.error || `Not found`
      data.message = data.message || `Invalid API: ${request.method} > ${request.url}`
    }

    return response.status(errorInfo.status || status).jsonp(data)
  }
}
