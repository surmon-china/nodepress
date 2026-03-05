/**
 * @file Admin auth service
 * @module module/admin/service.auth
 * @author Surmon <https://github.com/surmon-china>
 */

import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthAccessTokenService } from '@app/core/auth/auth.service.access-token'
import { AuthRefreshTokenService } from '@app/core/auth/auth.service.refresh-token'
import { AuthTokenResult } from '@app/core/auth/auth.interface'
import { decodeBase64 } from '@app/transformers/codec.transformer'
import { AuthRole, AuthPayload } from '@app/constants/auth.constant'
import { APP_AUTH } from '@app/app.config'
import { AdminProfileService } from './admin.service.profile'

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly adminProfileService: AdminProfileService,
    private readonly accessTokenService: AuthAccessTokenService,
    private readonly refreshTokenService: AuthRefreshTokenService
  ) {}

  /** Sign a admin auth token */
  private async createToken(): Promise<AuthTokenResult> {
    const authPayload: AuthPayload = { role: AuthRole.Admin }

    // access token
    const expiresIn = APP_AUTH.jwtExpiresInForAdmin
    const accessToken = this.accessTokenService.signToken(authPayload, { expiresIn })

    // refresh token
    const refreshToken = this.refreshTokenService.generateToken()
    const refreshExpiresIn = APP_AUTH.refreshTokenExpiresInForAdmin
    await this.refreshTokenService.storeToken(refreshToken, authPayload, refreshExpiresIn)

    return {
      token_type: 'Bearer',
      access_token: accessToken,
      expires_in: expiresIn,
      refresh_token: refreshToken
    }
  }

  public async createTokenByPassword(base64Password: string): Promise<AuthTokenResult> {
    const inputPassword = decodeBase64(base64Password)
    const existedAdminDoc = await this.adminProfileService.getDocument()
    const isValidPassword = await this.adminProfileService.validatePassword(
      inputPassword,
      existedAdminDoc?.password
    )

    if (!isValidPassword) {
      throw new UnauthorizedException('Password incorrect')
    }

    return await this.createToken()
  }

  public async refreshToken(refreshToken: string): Promise<AuthTokenResult> {
    const payload = await this.refreshTokenService.getPayload(refreshToken)
    if (!payload || payload.role !== AuthRole.Admin) {
      throw new UnauthorizedException('Invalid refresh token')
    }

    await this.refreshTokenService.revokeToken(refreshToken)
    return await this.createToken()
  }

  public async revokeTokens(accessToken: string, refreshToken?: string): Promise<void> {
    await this.accessTokenService.invalidateToken(accessToken)
    if (refreshToken) await this.refreshTokenService.revokeToken(refreshToken)
  }
}
