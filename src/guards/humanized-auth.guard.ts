/**
 * @file Humanized JwtAuth guard
 * @module guard/humanized-auth
 * @author Surmon <https://github.com/surmon-china>
 */

import { AuthGuard } from '@nestjs/passport'
import { ExecutionContext, Injectable } from '@nestjs/common'
import { HttpUnauthorizedError } from '@app/errors/unauthorized.error'
import { UNDEFINED } from '@app/constants/value.constant'

/**
 * @class HumanizedJwtAuthGuard
 * @classdesc 检验规则：Token 不存在 | Token 存在且有效
 * @example @UseGuards(HumanizedJwtAuthGuard)
 */
@Injectable()
export class HumanizedJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context)
  }

  /**
   * @function handleRequest
   * @description 如果 Token 不存在或 Token 存在并有效，都是通行
   */
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
