/**
 * @file Auth token service
 * @module module/account/auth/service.token
 * @author Surmon <https://github.com/surmon-china>
 */

import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthAccessTokenService } from '@app/core/auth/auth.service.access-token'
import { AuthRefreshTokenService } from '@app/core/auth/auth.service.refresh-token'
import { AuthTokenResult } from '@app/core/auth/auth.interface'
import { AuthRole, AuthPayload } from '@app/constants/auth.constant'
import { APP_AUTH } from '@app/app.config'

@Injectable()
export class UserAuthTokenService {
  constructor(
    private readonly accessTokenService: AuthAccessTokenService,
    private readonly refreshTokenService: AuthRefreshTokenService
  ) {}

  /** Sign a user auth token */
  public async createToken(userId: number): Promise<AuthTokenResult> {
    const authPayload: AuthPayload = { role: AuthRole.User, uid: userId }

    // access token
    const expiresIn = APP_AUTH.jwtExpiresInForUser
    const accessToken = this.accessTokenService.signToken(authPayload, { expiresIn })

    // refresh token
    const refreshToken = this.refreshTokenService.generateToken()
    const refreshExpiresIn = APP_AUTH.refreshTokenExpiresInForUser
    await this.refreshTokenService.storeToken(refreshToken, authPayload, refreshExpiresIn)

    return {
      token_type: 'Bearer',
      access_token: accessToken,
      expires_in: expiresIn,
      refresh_token: refreshToken
    }
  }

  public async refreshToken(refreshToken: string): Promise<AuthTokenResult> {
    const payload = await this.refreshTokenService.getPayload(refreshToken)
    if (!payload || payload.role !== AuthRole.User || !payload.uid) {
      throw new UnauthorizedException('Invalid or expired refresh token')
    }

    await this.refreshTokenService.revokeToken(refreshToken)
    return await this.createToken(payload.uid)
  }

  public async revokeTokens(accessToken: string, refreshToken?: string): Promise<void> {
    await this.accessTokenService.invalidateToken(accessToken)
    if (refreshToken) await this.refreshTokenService.revokeToken(refreshToken)
  }
}
