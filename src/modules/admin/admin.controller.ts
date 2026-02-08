/**
 * @file Admin controller
 * @module module/admin/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import { Controller, Get, Put, Post, Body, UseGuards } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { AdminOnlyGuard } from '@app/guards/admin-only.guard'
import { SuccessResponse } from '@app/decorators/success-response.decorator'
import { RequestContext, IRequestContext } from '@app/decorators/request-context.decorator'
import { EventKeys } from '@app/constants/events.constant'
import { AuthService } from '@app/core/auth/auth.service'
import { AdminService } from './admin.service'
import { TokenResult } from './admin.interface'
import { AuthLoginDTO, AdminUpdateDTO } from './admin.dto'
import { Admin } from './admin.model'

@Controller('admin')
export class AdminController {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly adminService: AdminService,
    private readonly authService: AuthService
  ) {}

  @Post('login')
  @SuccessResponse('Login succeeded')
  async login(@RequestContext() { visitor }: IRequestContext, @Body() body: AuthLoginDTO): Promise<TokenResult> {
    const token = await this.adminService.login(body.password)
    this.eventEmitter.emit(EventKeys.AdminLoggedIn, visitor)
    return token
  }

  @Post('logout')
  @UseGuards(AdminOnlyGuard)
  @SuccessResponse('Logout succeeded')
  async logout(@RequestContext() { token }: IRequestContext): Promise<string> {
    await this.authService.invalidateToken(token!)
    this.eventEmitter.emit(EventKeys.AdminLoggedOut, token)
    return 'ok'
  }

  // Refresh token
  @Post('refresh-token')
  @UseGuards(AdminOnlyGuard)
  @SuccessResponse('Refresh token succeeded')
  refreshToken(): TokenResult {
    return this.adminService.createToken()
  }

  // Check token
  @Get('check-token')
  @UseGuards(AdminOnlyGuard)
  @SuccessResponse('Token is valid')
  checkToken(): string {
    return 'ok'
  }

  @Get('profile')
  @SuccessResponse('Get admin profile succeeded')
  getAdminProfile(): Promise<Admin> {
    return this.adminService.getProfile()
  }

  @Put('profile')
  @UseGuards(AdminOnlyGuard)
  @SuccessResponse('Update admin profile succeeded')
  putAdminProfile(@Body() adminProfile: AdminUpdateDTO): Promise<Admin> {
    return this.adminService.updateProfile(adminProfile)
  }
}
