/**
 * @file Auth controller
 * @module module/account/auth/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import type { FastifyReply } from 'fastify'
import { Throttle, minutes } from '@nestjs/throttler'
import { Controller, Get, Post, Query, Response, BadRequestException } from '@nestjs/common'
import { RequestContext, IRequestContext } from '@app/decorators/request-context.decorator'
import { SuccessResponse } from '@app/decorators/success-response.decorator'
import { OnlyIdentity, IdentityRole } from '@app/decorators/only-identity.decorator'
import { ResponseStatus } from '@app/interfaces/response.interface'
import { getMessageFromNormalError } from '@app/transformers/error.transformer'
import { UserIdentity } from '@app/modules/user/user.model'
import { AccountIdentityService } from '../account.service.identity'
import { UserAuthStateService, AuthIntent, AuthStatePayload } from './auth.service.state'
import { UserAuthTokenService } from './auth.service.token'
import { GithubAuthService } from './auth.service.github'
import { GoogleAuthService } from './auth.service.google'
import { OAuthCallbackDto } from './auth.dto'
import { sendWindowPostMessage, OAUTH_CALLBACK_SCRIPT } from './auth.helper'

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

  // To maintain a secure `content-security-policy`, inline JavaScript is not used here.
  // So we decouple the execution logic into this dedicated static script endpoint.
  // This allows us to strictly adhere to 'script-src: self' by loading the logic from a
  // trusted source, while using a non-executable <script type="application/json">
  // block in the main HTML to safely pass dynamic payloads without triggering CSP violations.
  @Get('oauth-callback.js')
  closeWindowScript(@Response() response: FastifyReply) {
    response.type('application/javascript').send(OAUTH_CALLBACK_SCRIPT)
  }

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
    try {
      // 1. Validate state parameter (CSRF mitigation)
      const statePayload = await this.authStateService.verifyCallbackState(state)
      // 2. Exchange authorization code for GitHub access token.
      const accessToken = await this.githubAuthService.getAccessTokenByCode(code)
      // 3. Fetch GitHub user profile using the obtained access token and normalize it into the internal identity format.
      const userInfo = await this.githubAuthService.getUserInfoByToken(accessToken)
      const userIdentity = this.githubAuthService.transformUserInfoToIdentity(userInfo)
      // 4. Resolve the OAuth intent (e.g., Login or Link) and execute the corresponding account flow.
      const message = await this.resolveOAuthIntent(statePayload, userIdentity)
      // 5. Securely transmit payload to the opener window and close the popup.
      sendWindowPostMessage(response, {
        status: ResponseStatus.Success,
        ...message
      })
    } catch (error) {
      // 6. Gracefully handle any OAuth-related error by sending a structured error response to the opener window.
      sendWindowPostMessage(response, {
        status: ResponseStatus.Error,
        error: getMessageFromNormalError(error)
      })
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
    try {
      const statePayload = await this.authStateService.verifyCallbackState(state)
      const userInfo = await this.googleAuthService.getUserInfoByCode(GOOGLE_CALLBACK_PATH, code)
      const userIdentity = this.googleAuthService.transformUserInfoToIdentity(userInfo)
      const message = await this.resolveOAuthIntent(statePayload, userIdentity)
      sendWindowPostMessage(response, {
        status: ResponseStatus.Success,
        ...message
      })
    } catch (error) {
      sendWindowPostMessage(response, {
        status: ResponseStatus.Error,
        error: getMessageFromNormalError(error)
      })
    }
  }

  private async resolveOAuthIntent(statePayload: AuthStatePayload, userIdentity: UserIdentity) {
    switch (statePayload.intent) {
      // OAuth login
      case AuthIntent.Login: {
        // Upsert local user record based on thrid-party profile information
        const user = await this.accountIdentityService.upsertUser(userIdentity)
        // Generate internal JWT for the authenticated user
        const token = this.authTokenService.createToken(user)
        return { type: AuthIntent.Login, token }
      }
      // OAuth link
      case AuthIntent.Link: {
        await this.accountIdentityService.addIdentity(statePayload.uid, userIdentity)
        return { type: AuthIntent.Link }
      }
      default:
        throw new BadRequestException('Invalid OAuth intent')
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
