/**
 * @file Admin controller
 * @module module/admin/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import { Controller, Get, Patch, Post, Body, UnauthorizedException } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { SuccessResponse } from '@app/decorators/success-response.decorator'
import { OnlyIdentity, IdentityRole } from '@app/decorators/only-identity.decorator'
import { RequestContext, IRequestContext } from '@app/decorators/request-context.decorator'
import { decodeBase64 } from '@app/transformers/codec.transformer'
import { EventKeys } from '@app/constants/events.constant'
import { AdminProfile } from './admin.model'
import { AuthLoginDto, UpdateProfileDto } from './admin.dto'
import { AdminAuthTokenService, TokenResult } from './admin.service.token'
import { AdminService } from './admin.service'

@Controller('admin')
export class AdminController {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly adminService: AdminService,
    private readonly authTokenService: AdminAuthTokenService
  ) {}

  @Post('login')
  @SuccessResponse('Login succeeded')
  async login(@RequestContext() { visitor }: IRequestContext, @Body() dto: AuthLoginDto): Promise<TokenResult> {
    const inputPassword = decodeBase64(dto.password)
    const existedAdminDoc = await this.adminService.getDocument()
    const isValidPassword = await this.adminService.validatePassword(inputPassword, existedAdminDoc?.password)
    if (!isValidPassword) {
      throw new UnauthorizedException('Password incorrect')
    }

    const token = this.authTokenService.createToken()
    this.eventEmitter.emit(EventKeys.AdminLoggedIn, visitor)
    return token
  }

  @Post('logout')
  @OnlyIdentity(IdentityRole.Admin)
  @SuccessResponse('Logout succeeded')
  async logout(@RequestContext() { identity }: IRequestContext): Promise<string> {
    await this.authTokenService.invalidateToken(identity.token!)
    this.eventEmitter.emit(EventKeys.AdminLoggedOut, identity.token)
    return 'ok'
  }

  // Refresh token
  @Post('refresh-token')
  @OnlyIdentity(IdentityRole.Admin)
  @SuccessResponse('Refresh token succeeded')
  refreshToken(): TokenResult {
    return this.authTokenService.createToken()
  }

  // Check token
  @Post('check-token')
  @OnlyIdentity(IdentityRole.Admin)
  @SuccessResponse('Token is valid')
  checkToken(): string {
    return 'ok'
  }

  @Get('profile')
  @SuccessResponse('Get admin profile succeeded')
  getAdminProfile(): Promise<AdminProfile> {
    return this.adminService.getProfileCache()
  }

  @Patch('profile')
  @OnlyIdentity(IdentityRole.Admin)
  @SuccessResponse('Update admin profile succeeded')
  updateAdminProfile(@Body() dto: UpdateProfileDto): Promise<AdminProfile> {
    return this.adminService.updateProfile(dto)
  }
}
