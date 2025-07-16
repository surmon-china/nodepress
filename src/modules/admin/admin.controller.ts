/**
 * @file Admin controller
 * @module module/admin/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import { Controller, Get, Put, Post, Body, UseGuards } from '@nestjs/common'
import { AdminOnlyGuard } from '@app/guards/admin-only.guard'
import { EmailService } from '@app/core/helper/helper.service.email'
import { IPService } from '@app/core/helper/helper.service.ip'
import { SuccessResponse } from '@app/decorators/success-response.decorator'
import { RequestContext, IRequestContext } from '@app/decorators/request-context.decorator'
import { AuthService } from '@app/core/auth/auth.service'
import { AdminService } from './admin.service'
import { AuthLoginDTO, AdminUpdateDTO } from './admin.dto'
import { TokenResult } from './admin.interface'
import { Admin } from './admin.model'
import { APP_BIZ } from '@app/app.config'

@Controller('admin')
export class AdminController {
  constructor(
    private readonly ipService: IPService,
    private readonly emailService: EmailService,
    private readonly adminService: AdminService,
    private readonly authService: AuthService
  ) {}

  @Post('login')
  @SuccessResponse('Login succeeded')
  async login(
    @RequestContext() { visitor: { ip } }: IRequestContext,
    @Body() body: AuthLoginDTO
  ): Promise<TokenResult> {
    const token = await this.adminService.login(body.password)
    if (ip) {
      const location = await this.ipService.queryLocation(ip)
      const subject = 'App has a new login activity'
      const locationText = location ? [location.country, location.region, location.city].join(' · ') : 'unknow'
      const content = `${subject}. IP: ${ip}, location: ${locationText}`
      this.emailService.sendMailAs(APP_BIZ.NAME, {
        to: APP_BIZ.ADMIN_EMAIL,
        subject,
        text: content,
        html: content
      })
    }
    return token
  }

  @Post('logout')
  @UseGuards(AdminOnlyGuard)
  @SuccessResponse('Logout succeeded')
  async logout(@RequestContext() { token }: IRequestContext): Promise<string> {
    await this.authService.invalidateToken(token!)
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
