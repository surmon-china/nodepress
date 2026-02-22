/**
 * @file Auth controller
 * @module module/user/auth/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import type { FastifyReply } from 'fastify'
import { Controller, Get, Post, Query, Response, HttpStatus } from '@nestjs/common'
import { UserGitHubExtraKeys, UserGoogleExtraKeys } from '@app/constants/extras.constant'
import { RequestContext, IRequestContext } from '@app/decorators/request-context.decorator'
import { SuccessResponse } from '@app/decorators/success-response.decorator'
import { OnlyIdentity, IdentityRole } from '@app/decorators/only-identity.decorator'
import { UserIdentityProvider } from '../user.constant'
import { UserAccountService } from '../me/me.service.account'
import { UserAuthStateService, AuthIntent } from './auth.service.state'
import { UserAuthTokenService } from './auth.service.token'
import { GithubAuthService } from './auth.service.github'
import { GoogleAuthService } from './auth.service.google'
import { OAuthCallbackDto } from './auth.dto'
import { sendWindowPostMessage } from './auth.helper'

const GITHUB_CALLBACK_PATH = '/user/auth/github/callback'
const GOOGLE_CALLBACK_PATH = '/user/auth/google/callback'

@Controller('user/auth')
export class UserAuthController {
  constructor(
    private readonly userAccountService: UserAccountService,
    private readonly authTokenService: UserAuthTokenService,
    private readonly authStateService: UserAuthStateService,
    private readonly googleAuthService: GoogleAuthService,
    private readonly githubAuthService: GithubAuthService
  ) {}

  // ==================== GitHub OAuth ====================

  @Get('github/link')
  @OnlyIdentity(IdentityRole.User)
  async githubLink(@RequestContext() { identity }: IRequestContext, @Response() response: FastifyReply) {
    const payload = { intent: AuthIntent.Link, uid: identity.payload!.uid! }
    const state = await this.authStateService.generateCallbackState(payload)
    const authorizeUrl = await this.githubAuthService.getAuthorizeURL(GITHUB_CALLBACK_PATH, state)
    response.redirect(authorizeUrl, HttpStatus.FOUND)
  }

  @Get('github/login')
  async githubLogin(@Response() response: FastifyReply) {
    const state = await this.authStateService.generateCallbackState({ intent: AuthIntent.Login })
    const authorizeUrl = await this.githubAuthService.getAuthorizeURL(GITHUB_CALLBACK_PATH, state)
    response.redirect(authorizeUrl, HttpStatus.FOUND)
  }

  @Get('github/callback')
  async githubOAuthCallback(@Query() { code, state }: OAuthCallbackDto, @Response() response: FastifyReply) {
    // 1. Validate state parameter (CSRF mitigation)
    const statePayload = await this.authStateService.verifyCallbackState(state)
    // 2. Exchange authorization code for GitHub access token
    const accessToken = await this.githubAuthService.getAccessTokenByCode(code)
    // 3. Fetch GitHub user profile using the obtained access token
    const userInfo = await this.githubAuthService.getUserInfoByToken(accessToken)
    // OAuth login
    if (statePayload.intent === AuthIntent.Login) {
      // 4. Upsert local user record based on GitHub profile information
      const user = await this.userAccountService.upsertUser({
        provider: UserIdentityProvider.GitHub,
        uid: String(userInfo.id),
        name: userInfo.name,
        email: userInfo.email,
        website: userInfo.blog,
        avatar: userInfo.avatar_url,
        extras: [
          { key: UserGitHubExtraKeys.Login, value: userInfo.login },
          { key: UserGitHubExtraKeys.Bio, value: userInfo.bio ?? '' }
        ]
      })
      // 5. Generate internal JWT for the authenticated user
      const userToken = this.authTokenService.createToken(user)
      // 6. Securely transmit token to the opener window and close the popup
      sendWindowPostMessage(response, { type: AuthIntent.Login, token: userToken })
    }
    // OAuth link
    if (statePayload.intent === AuthIntent.Link) {
      await this.userAccountService.addIdentity(statePayload.uid, {
        provider: UserIdentityProvider.GitHub,
        uid: String(userInfo.id)
      })
      sendWindowPostMessage(response, { type: AuthIntent.Link })
    }
  }

  // ==================== Google OAuth ====================

  @Get('google/link')
  @OnlyIdentity(IdentityRole.User)
  async googleLink(@RequestContext() { identity }: IRequestContext, @Response() response: FastifyReply) {
    const payload = { intent: AuthIntent.Link, uid: identity.payload!.uid! }
    const state = await this.authStateService.generateCallbackState(payload)
    const authorizeUrl = await this.googleAuthService.getAuthorizeURL(GOOGLE_CALLBACK_PATH, state)
    response.redirect(authorizeUrl, HttpStatus.FOUND)
  }

  @Get('google/login')
  async googleLogin(@Response() response: FastifyReply) {
    const state = await this.authStateService.generateCallbackState({ intent: AuthIntent.Login })
    const authorizeUrl = await this.googleAuthService.getAuthorizeURL(GOOGLE_CALLBACK_PATH, state)
    response.redirect(authorizeUrl, HttpStatus.FOUND)
  }

  @Get('google/callback')
  async googleOAuthCallback(@Query() { code, state }: OAuthCallbackDto, @Response() response: FastifyReply) {
    const statePayload = await this.authStateService.verifyCallbackState(state)
    const userInfo = await this.googleAuthService.getUserInfoByCode(GOOGLE_CALLBACK_PATH, code)
    // OAuth login
    if (statePayload.intent === AuthIntent.Login) {
      const user = await this.userAccountService.upsertUser({
        provider: UserIdentityProvider.Google,
        uid: userInfo.sub,
        name: userInfo.name,
        email: userInfo.email,
        avatar: userInfo.picture,
        website: null,
        extras: [{ key: UserGoogleExtraKeys.GivenName, value: userInfo.given_name }]
      })
      const userToken = this.authTokenService.createToken(user)
      sendWindowPostMessage(response, { type: AuthIntent.Login, token: userToken })
    }
    // OAuth link
    if (statePayload.intent === AuthIntent.Link) {
      await this.userAccountService.addIdentity(statePayload.uid, {
        provider: UserIdentityProvider.Google,
        uid: userInfo.sub
      })
      sendWindowPostMessage(response, { type: AuthIntent.Link })
    }
  }

  // ==================== Logout ====================

  @Post('logout')
  @OnlyIdentity(IdentityRole.User)
  @SuccessResponse('Logout succeeded')
  async logout(@RequestContext() { identity }: IRequestContext): Promise<string> {
    await this.authTokenService.invalidateToken(identity.token!)
    return 'ok'
  }
}
