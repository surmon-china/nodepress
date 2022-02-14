/**
 * @file AdminMaybe guard
 * @module guard/admin-maybe
 * @author Surmon <https://github.com/surmon-china>
 */

import { AuthGuard } from '@nestjs/passport'
import { ExecutionContext, Injectable } from '@nestjs/common'
import { HttpUnauthorizedError } from '@app/errors/unauthorized.error'
import { UNDEFINED } from '@app/constants/value.constant'

/**
 * @class AdminMaybeGuard
 * @classdesc Token isn't existed | Token validated
 * @example ```@UseGuards(AdminMaybeGuard)```
 */
@Injectable()
export class AdminMaybeGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context)
  }

  handleRequest(error, authInfo, errInfo) {
    const validToken = Boolean(authInfo)
    // MARK: https://github.com/mikenicholson/passport-jwt/issues/174
    const emptyToken = !authInfo && errInfo?.message === 'No auth token'
    if (!error && (validToken || emptyToken)) {
      return authInfo
    } else {
      throw error || new HttpUnauthorizedError(UNDEFINED, errInfo?.message)
    }
  }
}
