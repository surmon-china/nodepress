/**
 * @file Google OAuth service
 * @module module/user/auth/service.google
 * @author Surmon <https://github.com/surmon-china>
 */

import { OAuth2Client } from 'google-auth-library'
import { Injectable } from '@nestjs/common'
import { createLogger } from '@app/utils/logger'
import { isDevEnv, isProdEnv } from '@app/app.environment'
import { APP_BIZ, GOOGLE_OAUTH } from '@app/app.config'

const logger = createLogger({ scope: 'GoogleAuthService', time: isDevEnv })

export interface GoogleUserInfo {
  sub: string
  name: string
  given_name: string
  picture: string
  email: string
  email_verified: boolean
}

@Injectable()
export class GoogleAuthService {
  public createClient(callbackPath: string) {
    const redirectUri = isProdEnv
      ? `${APP_BIZ.URL}${callbackPath}`
      : `http://localhost:${APP_BIZ.PORT}${callbackPath}`

    // https://developers.google.com/identity/openid-connect/openid-connect
    return new OAuth2Client({
      client_id: GOOGLE_OAUTH.clientId,
      client_secret: GOOGLE_OAUTH.clientSecret,
      redirect_uris: [redirectUri]
    })
  }

  public getAuthorizeURL(callbackPath: string, state: string) {
    return this.createClient(callbackPath).generateAuthUrl({
      access_type: 'offline',
      scope: GOOGLE_OAUTH.scope,
      state
    })
  }

  public async getUserInfoByCode(callbackPath: string, code: string) {
    const client = this.createClient(callbackPath)
    const { tokens } = await client.getToken(code)
    client.setCredentials(tokens)
    const response = await client.request<GoogleUserInfo>({
      url: 'https://www.googleapis.com/oauth2/v3/userinfo'
    })
    return response.data
  }
}
