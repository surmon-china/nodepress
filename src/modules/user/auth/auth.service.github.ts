/**
 * @file GitHub OAuth service
 * @module module/user/auth/service.github
 * @author Surmon <https://github.com/surmon-china>
 */

import { HttpService } from '@nestjs/axios'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { createLogger } from '@app/utils/logger'
import { isDevEnv, isProdEnv } from '@app/app.environment'
import { APP_BIZ, GITHUB_OAUTH } from '@app/app.config'
import { UserIdentityProvider } from '../user.constant'
import { UserIdentity } from '../user.model'

const logger = createLogger({ scope: 'GithubAuthService', time: isDevEnv })

export interface GitHubUserInfo {
  login: string
  id: number
  node_id: string
  avatar_url: string
  name: string
  blog: string
  email: string | null
  bio: string | null
  location: string | null
}

@Injectable()
export class GithubAuthService {
  constructor(private readonly httpService: HttpService) {}

  /** Generate GitHub authorization URL with a unique state */
  public async getAuthorizeURL(callbackPath: string, state: string) {
    const redirectUri = isProdEnv
      ? `${APP_BIZ.URL}${callbackPath}`
      : `http://localhost:${APP_BIZ.PORT}${callbackPath}`

    // https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps
    const url = new URL('https://github.com/login/oauth/authorize')
    url.searchParams.set('client_id', GITHUB_OAUTH.clientId)
    url.searchParams.set('redirect_uri', redirectUri)
    url.searchParams.set('state', state)
    url.searchParams.set('scope', GITHUB_OAUTH.scope)

    return url.toString()
  }

  /** Exchange the temporary authorization code for an access token */
  public async getAccessTokenByCode(code: string) {
    const api = 'https://github.com/login/oauth/access_token'
    const data = {
      client_id: GITHUB_OAUTH.clientId,
      client_secret: GITHUB_OAUTH.clientSecret,
      code
    }

    // https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#2-users-are-redirected-back-to-your-site-by-github
    return this.httpService.axiosRef
      .post(api, data, { headers: { Accept: 'application/json' } })
      .then((response) => response.data.access_token as string)
      .catch((error) => {
        logger.error('Failed to fetch AccessToken:', error)
        throw new UnauthorizedException('GitHub authentication failed. Please try again later.')
      })
  }

  /** Fetch GitHub user profile using the access token */
  public getUserInfoByToken(accessToken: string): Promise<GitHubUserInfo> {
    return this.httpService.axiosRef
      .get('https://api.github.com/user', { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((response) => response.data)
      .catch((error) => {
        logger.error('Failed to fetch GitHub user info:', error)
        throw new UnauthorizedException('Failed to retrieve GitHub profile. Please re-authenticate.')
      })
  }

  public transformUserInfoToIdentity(userInfo: GitHubUserInfo): UserIdentity {
    return {
      provider: UserIdentityProvider.GitHub,
      uid: String(userInfo.id),
      email: userInfo.email,
      username: userInfo.login,
      display_name: userInfo.name,
      avatar_url: userInfo.avatar_url,
      profile_url: userInfo.blog
    }
  }
}
