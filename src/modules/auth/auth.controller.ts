/**
 * @file Auth controller
 * @module module/auth/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import { Controller, Get, Put, Post, Body, UseGuards, HttpStatus } from '@nestjs/common'
import { JwtAuthGuard } from '@app/guards/auth.guard'
import { IPService } from '@app/processors/helper/helper.service.ip'
import { EmailService } from '@app/processors/helper/helper.service.email'
import { HttpProcessor } from '@app/decorators/http.decorator'
import { QueryParams } from '@app/decorators/query-params.decorator'
import { Auth, AuthPasswordPayload } from './auth.model'
import { AuthService } from './auth.service'
import { TokenResult } from './auth.interface'
import { APP, EMAIL } from '@app/app.config'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly ipService: IPService,
    private readonly emailService: EmailService,
    private readonly authService: AuthService
  ) {}

  @Post('login')
  @HttpProcessor.handle({ message: 'Login', error: HttpStatus.BAD_REQUEST })
  async login(@QueryParams() { visitor: { ip } }, @Body() body: AuthPasswordPayload): Promise<TokenResult> {
    const token = await this.authService.adminLogin(body.password)
    const location = await this.ipService.queryLocation(ip)
    const subject = `${APP.NAME} has new login activity`
    const city = location?.city || 'unknow'
    const country = location?.country || 'unknow'
    const content = `IP: ${ip}, location: ${country} - ${city}`
    this.emailService.sendMail({
      subject,
      to: EMAIL.admin,
      text: `${subject}，${content}`,
      html: `${subject}，${content}`,
    })
    return token
  }

  @Get('admin')
  @HttpProcessor.handle('Get admin info')
  getAdminInfo(): Promise<Auth> {
    return this.authService.getAdminInfo()
  }

  @Put('admin')
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('Update admin info')
  putAdminInfo(@Body() auth: Auth): Promise<Auth> {
    return this.authService.putAdminInfo(auth)
  }

  // check token
  @Post('check')
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('Check token')
  checkToken(): string {
    return 'ok'
  }

  // refresh token
  @Post('renewal')
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('Renewal Token')
  renewalToken(): TokenResult {
    return this.authService.createToken()
  }
}
