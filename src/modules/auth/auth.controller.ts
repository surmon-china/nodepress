/**
 * @file Auth controller
 * @module module/auth/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import { Controller, Get, Put, Post, Body, UseGuards, HttpStatus } from '@nestjs/common'
import { AdminOnlyGuard } from '@app/guards/admin-only.guard'
import { IPService } from '@app/processors/helper/helper.service.ip'
import { EmailService } from '@app/processors/helper/helper.service.email'
import { Responser } from '@app/decorators/responser.decorator'
import { QueryParams, QueryParamsResult } from '@app/decorators/queryparams.decorator'
import { AuthLoginDTO, AuthUpdateDTO } from './auth.dto'
import { AuthService } from './auth.service'
import { TokenResult } from './auth.interface'
import { Auth } from './auth.model'
import { APP } from '@app/app.config'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly ipService: IPService,
    private readonly emailService: EmailService,
    private readonly authService: AuthService
  ) {}

  @Post('login')
  @Responser.handle({ message: 'Login', error: HttpStatus.BAD_REQUEST })
  async login(
    @QueryParams() { visitor: { ip } }: QueryParamsResult,
    @Body() body: AuthLoginDTO
  ): Promise<TokenResult> {
    const token = await this.authService.adminLogin(body.password)
    if (ip) {
      this.ipService.queryLocation(ip).then((location) => {
        const subject = `App has new login activity`
        const locationText = location ? [location.country, location.region, location.city].join(' · ') : 'unknow'
        const content = `${subject}, IP: ${ip}, location: ${locationText}`
        this.emailService.sendMailAs(APP.NAME, {
          to: APP.ADMIN_EMAIL,
          subject,
          text: content,
          html: content,
        })
      })
    }
    return token
  }

  @Get('admin')
  @Responser.handle('Get admin info')
  getAdminInfo(): Promise<Auth> {
    return this.authService.getAdminInfo()
  }

  @Put('admin')
  @UseGuards(AdminOnlyGuard)
  @Responser.handle('Update admin info')
  putAdminInfo(@Body() auth: AuthUpdateDTO): Promise<Auth> {
    return this.authService.putAdminInfo(auth)
  }

  // check token
  @Post('check')
  @UseGuards(AdminOnlyGuard)
  @Responser.handle('Check token')
  checkToken(): string {
    return 'ok'
  }

  // refresh token
  @Post('renewal')
  @UseGuards(AdminOnlyGuard)
  @Responser.handle('Renewal Token')
  renewalToken(): TokenResult {
    return this.authService.createToken()
  }
}
