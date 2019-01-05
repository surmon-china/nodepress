/**
 * Auth controller.
 * @file 权限模块控制器
 * @module module/auth/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import * as APP_CONFIG from '@app/app.config';
import { Controller, Get, Put, Post, Body, UseGuards, HttpStatus } from '@nestjs/common';
import { HttpProcessor } from '@app/decorators/http.decorator';
import { JwtAuthGuard } from '@app/guards/auth.guard';
import { EmailService } from '@app/processors/helper/helper.service.email';
import { QueryParams } from '@app/decorators/query-params.decorator';
import { AuthService } from './auth.service';
import { ITokenResult } from './auth.interface';
import { Auth, AuthLogin } from './auth.model';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
  ) {}

  @Get('admin')
  @HttpProcessor.handle('获取管理员信息')
  getAdminInfo(): Promise<Auth> {
    return this.authService.getAdminInfo();
  }

  @Put('admin')
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle({ message: '修改管理员信息', error: HttpStatus.BAD_REQUEST })
  putAdminInfo(@Body() auth: Auth): Promise<Auth> {
    return this.authService.putAdminInfo(auth);
  }

  @Post('login')
  @HttpProcessor.handle({ message: '登陆', error: HttpStatus.BAD_REQUEST })
  createToken(@QueryParams() { ip }, @Body() body: AuthLogin): Promise<ITokenResult> {
    return this.authService.createToken(body.password).then(data => {
      this.emailService.sendMail({
        to: APP_CONFIG.EMAIL.admin,
        subject: '博客有新的登陆行为',
        text: `来源 IP：${ip}，地理位置为：`,
        html: `来源 IP：${ip}，地理位置为：`,
      });
      return data;
    });
  }

  // 检测 Token 有效性
  @Post('check')
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('检测 Token')
  checkToken(): string {
    return 'ok';
  }
}
