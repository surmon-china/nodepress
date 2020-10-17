/**
 * Auth controller.
 * @file 权限模块控制器
 * @module module/auth/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import { Controller, Get, Put, Post, Body, UseGuards, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from '@app/guards/auth.guard';
import { IPService } from '@app/processors/helper/helper.service.ip';
import { EmailService } from '@app/processors/helper/helper.service.email';
import { HttpProcessor } from '@app/decorators/http.decorator';
import { QueryParams } from '@app/decorators/query-params.decorator';
import { AuthService } from './auth.service';
import { ITokenResult } from './auth.interface';
import { Auth, AuthLogin } from './auth.model';
import * as APP_CONFIG from '@app/app.config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly ipService: IPService,
    private readonly emailService: EmailService,
    private readonly authService: AuthService,
  ) {}

  @Get('admin')
  @HttpProcessor.handle('获取管理员信息')
  getAdminInfo(): Promise<Auth> {
    return this.authService.getAdminInfo();
  }

  @Put('admin')
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('修改管理员信息')
  putAdminInfo(@Body() auth: Auth): Promise<Auth> {
    return this.authService.putAdminInfo(auth);
  }

  @Post('login')
  @HttpProcessor.handle({ message: '登陆', error: HttpStatus.BAD_REQUEST })
  async login(@QueryParams() { visitors: { ip }}, @Body() body: AuthLogin): Promise<ITokenResult> {
    const token = await this.authService.adminLogin(body.password);
    const ipLocation = await this.ipService.query(ip);
    const subject = '博客有新的登陆行为';
    const city = ipLocation?.city || '未知城市';
    const country = ipLocation?.country || '未知国家';
    const content = `来源 IP：${ip}，地理位置为：${country} - ${city}`;
    this.emailService.sendMail({
      subject,
      to: APP_CONFIG.EMAIL.admin,
      text: `${subject}，${content}`,
      html: `${subject}，${content}`,
    });
    return token;
  }

  // 检测 Token 有效性
  @Post('check')
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('检测 Token')
  checkToken(): string {
    return 'ok';
  }

  // Token 续期，拿旧 Token 换新 Token
  @Post('renewal')
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('Token 续签')
  renewalToken(): ITokenResult {
    return this.authService.createToken();
  }
}
