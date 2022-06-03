/**
 * @file 401 HttpUnauthorized error
 * @module error/unauthorized
 * @author Surmon <https://github.com/surmon-china>
 */

import { UnauthorizedException } from '@nestjs/common'
import { ResponseMessage } from '@app/interfaces/response.interface'
import * as TEXT from '@app/constants/text.constant'

/**
 * @class HttpUnauthorizedError
 * @classdesc 401 -> unauthorized
 * @example new HttpUnauthorizedError('unauthorized')
 * @example new HttpUnauthorizedError('error message', new Error())
 */
export class HttpUnauthorizedError extends UnauthorizedException {
  constructor(message?: ResponseMessage, error?: any) {
    super(message || TEXT.HTTP_UNAUTHORIZED_TEXT_DEFAULT, error)
  }
}
