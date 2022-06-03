/**
 * @file 403 HttpForbidden error
 * @module error/forbidden
 * @author Surmon <https://github.com/surmon-china>
 */

import { HttpException, HttpStatus } from '@nestjs/common'
import * as TEXT from '@app/constants/text.constant'

/**
 * @class HttpForbiddenError
 * @classdesc 403 -> forbidden
 * @example new HttpForbiddenError('error message')
 * @example new HttpForbiddenError(new Error())
 */
export class HttpForbiddenError extends HttpException {
  constructor(error?: any) {
    super(error || TEXT.HTTP_PARAMS_PERMISSION_ERROR_DEFAULT, HttpStatus.FORBIDDEN)
  }
}
