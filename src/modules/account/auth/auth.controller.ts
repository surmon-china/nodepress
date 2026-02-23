/**
 * @file Auth controller
 * @module module/account/auth/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import type { FastifyReply } from 'fastify'
import { Throttle, minutes } from '@nestjs/throttler'
import { Controller, Get, Post, Query, Response } from '@nestjs/common'
import { RequestContext, IRequestContext } from '@app/decorators/request-context.decorator'
import { SuccessResponse } from '@app/decorators/success-response.decorator'
import { OnlyIdentity, IdentityRole } from '@app/decorators/only-identity.decorator'
import { AccountIdentityService } from '../account.service.identity'
import { UserAuthStateService, AuthIntent } from './auth.service.state'
import { UserAuthTokenService } from './auth.service.token'
import { GithubAuthService } from './auth.service.github'
import { GoogleAuthService } from './auth.service.google'
import { OAuthCallbackDto } from './auth.dto'
import { sendWindowPostMessage } from './auth.helper'

const GITHUB_CALLBACK_PATH = '/account/auth/github/callback'
const GOOGLE_CALLBACK_PATH = '/account/auth/google/callback'

@Controller('account/auth')
export class AccountAuthController {
  constructor(
    private readonly accountIdentityService: AccountIdentityService,
    private readonly authTokenService: UserAuthTokenService,
    private readonly authStateService: UserAuthStateService,
    private readonly googleAuthService: GoogleAuthService,
    private readonly githubAuthService: GithubAuthService
  ) {}

  // ==================== GitHub OAuth ====================

  @Get('github/link')
  @OnlyIdentity(IdentityRole.User)
  @Throttle({ default: { ttl: minutes(1), limit: 10 } })
  @SuccessResponse('Get GitHub link URL succeeded')
  async githubLink(@RequestContext() { identity }: IRequestContext) {
    const payload = { intent: AuthIntent.Link, uid: identity.payload!.uid! }
    const state = await this.authStateService.generateCallbackState(payload)
    const authorizeUrl = await this.githubAuthService.getAuthorizeURL(GITHUB_CALLBACK_PATH, state)
    return { url: authorizeUrl }
  }

  @Get('github/login')
  @Throttle({ default: { ttl: minutes(1), limit: 10 } })
  @SuccessResponse('Get GitHub login URL succeeded')
  async githubLogin() {
    const state = await this.authStateService.generateCallbackState({ intent: AuthIntent.Login })
    const authorizeUrl = await this.githubAuthService.getAuthorizeURL(GITHUB_CALLBACK_PATH, state)
    return { url: authorizeUrl }
  }

  @Get('github/callback')
  async githubOAuthCallback(@Query() { code, state }: OAuthCallbackDto, @Response() response: FastifyReply) {
    // 1. Validate state parameter (CSRF mitigation)
    const statePayload = await this.authStateService.verifyCallbackState(state)
    // 2. Exchange authorization code for GitHub access token
    const accessToken = await this.githubAuthService.getAccessTokenByCode(code)
    // 3. Fetch GitHub user profile using the obtained access token
    const userInfo = await this.githubAuthService.getUserInfoByToken(accessToken)
    const userIdentity = this.githubAuthService.transformUserInfoToIdentity(userInfo)
    // OAuth login
    if (statePayload.intent === AuthIntent.Login) {
      // 4. Upsert local user record based on GitHub profile information
      const user = await this.accountIdentityService.upsertUser(userIdentity)
      // 5. Generate internal JWT for the authenticated user
      const userToken = this.authTokenService.createToken(user)
      // 6. Securely transmit token to the opener window and close the popup
      sendWindowPostMessage(response, { type: AuthIntent.Login, token: userToken })
    }
    // OAuth link
    if (statePayload.intent === AuthIntent.Link) {
      await this.accountIdentityService.addIdentity(statePayload.uid, userIdentity)
      sendWindowPostMessage(response, { type: AuthIntent.Link })
    }
  }

  // ==================== Google OAuth ====================

  @Get('google/link')
  @OnlyIdentity(IdentityRole.User)
  @Throttle({ default: { ttl: minutes(1), limit: 10 } })
  @SuccessResponse('Get Google link URL succeeded')
  async googleLink(@RequestContext() { identity }: IRequestContext) {
    const payload = { intent: AuthIntent.Link, uid: identity.payload!.uid! }
    const state = await this.authStateService.generateCallbackState(payload)
    const authorizeUrl = await this.googleAuthService.getAuthorizeURL(GOOGLE_CALLBACK_PATH, state)
    return { url: authorizeUrl }
  }

  @Get('google/login')
  @Throttle({ default: { ttl: minutes(1), limit: 10 } })
  @SuccessResponse('Get Google login URL succeeded')
  async googleLogin() {
    const state = await this.authStateService.generateCallbackState({ intent: AuthIntent.Login })
    const authorizeUrl = await this.googleAuthService.getAuthorizeURL(GOOGLE_CALLBACK_PATH, state)
    return { url: authorizeUrl }
  }

  @Get('google/callback')
  async googleOAuthCallback(@Query() { code, state }: OAuthCallbackDto, @Response() response: FastifyReply) {
    const statePayload = await this.authStateService.verifyCallbackState(state)
    const userInfo = await this.googleAuthService.getUserInfoByCode(GOOGLE_CALLBACK_PATH, code)
    const userIdentity = this.googleAuthService.transformUserInfoToIdentity(userInfo)
    // OAuth login
    if (statePayload.intent === AuthIntent.Login) {
      const user = await this.accountIdentityService.upsertUser(userIdentity)
      const userToken = this.authTokenService.createToken(user)
      sendWindowPostMessage(response, { type: AuthIntent.Login, token: userToken })
    }
    // OAuth link
    if (statePayload.intent === AuthIntent.Link) {
      await this.accountIdentityService.addIdentity(statePayload.uid, userIdentity)
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
