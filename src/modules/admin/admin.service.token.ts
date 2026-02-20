/**
 * @file Auth token service
 * @module module/admin/service.token
 * @author Surmon <https://github.com/surmon-china>
 */

import { Injectable } from '@nestjs/common'
import { AuthService } from '@app/core/auth/auth.service'
import { AuthRole } from '@app/constants/auth.constant'
import { APP_AUTH } from '@app/app.config'

export interface TokenResult {
  access_token: string
  expires_in: number
}

@Injectable()
export class AdminAuthTokenService {
  constructor(private readonly authService: AuthService) {}

  /** Sign a admin auth token */
  public createToken(): TokenResult {
    return {
      expires_in: APP_AUTH.jwtExpiresInForAdmin,
      access_token: this.authService.signToken(
        { role: AuthRole.Admin },
        { expiresIn: APP_AUTH.jwtExpiresInForAdmin }
      )
    }
  }

  /** Invalidate admin auth token */
  public invalidateToken(token: string) {
    return this.authService.invalidateToken(token)
  }
}
