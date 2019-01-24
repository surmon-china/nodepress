/**
 * HttpForbidden error.
 * @file 403 错误生成器
 * @module error/forbidden
 * @author Surmon <https://github.com/surmon-china>
 */

import * as TEXT from '@app/constants/text.constant';
import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * @class HttpForbiddenError
 * @classdesc 403 -> 无权限/权限不足
 * @example new HttpForbiddenError('错误信息')
 * @example new HttpForbiddenError(new Error())
 */
export class HttpForbiddenError extends HttpException {
  constructor(error?: any) {
    super(error || TEXT.HTTP_PARAMS_PERMISSION_ERROR_DEFAULT, HttpStatus.FORBIDDEN);
  }
}
