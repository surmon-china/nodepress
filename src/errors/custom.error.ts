/**
 * Custom error.
 * @file 错误定制器
 * @module error/custom
 * @author Surmon <https://github.com/surmon-china>
 */

import { HttpException, HttpStatus } from '@nestjs/common';
import { TExceptionOption } from '@app/interfaces/http.interface';

/**
 * @class CustomError
 * @classdesc 默认 500 -> 服务端出错
 * @example new CustomError({ message: '错误信息' }, 400)
 * @example new CustomError({ message: '错误信息', error: new Error(xxx) })
 */
export class CustomError extends HttpException {
  constructor(options: TExceptionOption, statusCode?: HttpStatus) {
    super(options, statusCode || HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
