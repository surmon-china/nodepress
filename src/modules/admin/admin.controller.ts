/**
 * @file Admin controller
 * @module module/admin/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import { Throttle, hours, minutes } from '@nestjs/throttler'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { Controller, Get, Patch, Post, Body } from '@nestjs/common'
import { SuccessResponse } from '@app/decorators/success-response.decorator'
import { OnlyIdentity, IdentityRole } from '@app/decorators/only-identity.decorator'
import { RequestContext, IRequestContext } from '@app/decorators/request-context.decorator'
import { AuthTokenResult } from '@app/core/auth/auth.interface'
import { GlobalEventKey } from '@app/constants/events.constant'
import { AdminProfile } from './admin.model'
import { UpdateProfileDto } from './admin.dto'
import { AuthLoginDto, AuthLogoutDto, AuthRefreshTokenDto } from './admin.dto'
import { AdminProfileService } from './admin.service.profile'
import { AdminAuthService } from './admin.service.auth'

@Controller('admin')
export class AdminController {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly adminProfileService: AdminProfileService,
    private readonly adminAuthService: AdminAuthService
  ) {}

  @Get('profile')
  @SuccessResponse('Get admin profile succeeded')
  getAdminProfile(): Promise<AdminProfile> {
    return this.adminProfileService.getCache()
  }

  @Patch('profile')
  @OnlyIdentity(IdentityRole.Admin)
  @SuccessResponse('Update admin profile succeeded')
  updateAdminProfile(@Body() dto: UpdateProfileDto): Promise<AdminProfile> {
    return this.adminProfileService.update(dto)
  }

  @Throttle({ default: { ttl: minutes(1), limit: 10 } })
  @Post('login')
  @SuccessResponse('Login succeeded')
  async login(
    @RequestContext() { visitor }: IRequestContext,
    @Body() { password }: AuthLoginDto
  ): Promise<AuthTokenResult> {
    const token = await this.adminAuthService.createTokenByPassword(password)
    this.eventEmitter.emit(GlobalEventKey.AdminLoggedIn, visitor)
    return token
  }

  @Post('logout')
  @OnlyIdentity(IdentityRole.Admin)
  @SuccessResponse('Logout succeeded')
  async logout(
    @RequestContext() { identity }: IRequestContext,
    @Body() { refresh_token }: AuthLogoutDto
  ): Promise<string> {
    await this.adminAuthService.revokeTokens(identity.token!, refresh_token)
    this.eventEmitter.emit(GlobalEventKey.AdminLoggedOut)
    return 'ok'
  }

  @Throttle({ default: { ttl: hours(1), limit: 10 } })
  @Post('refresh-token')
  @SuccessResponse('Refresh token succeeded')
  refreshToken(@Body() { refresh_token }: AuthRefreshTokenDto): Promise<AuthTokenResult> {
    return this.adminAuthService.refreshToken(refresh_token)
  }

  @Post('verify-token')
  @OnlyIdentity(IdentityRole.Admin)
  @SuccessResponse('Token is valid')
  verifyToken(): string {
    return 'ok'
  }
}
