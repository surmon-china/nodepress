/**
 * @file Auth token service
 * @module module/user/auth/service.token
 * @author Surmon <https://github.com/surmon-china>
 */

import { Injectable } from '@nestjs/common'
import { AuthService } from '@app/core/auth/auth.service'
import { AuthRole } from '@app/constants/auth.constant'
import { APP_AUTH } from '@app/app.config'
import { User } from '../user.model'

@Injectable()
export class UserAuthTokenService {
  constructor(private readonly authService: AuthService) {}

  /** Sign a user auth token */
  public createToken(user: User) {
    return this.authService.signToken(
      { role: AuthRole.User, uid: user.id! },
      { expiresIn: APP_AUTH.jwtExpiresInForUser }
    )
  }

  /** Invalidate user auth token */
  public invalidateToken(token: string) {
    return this.authService.invalidateToken(token)
  }
}
