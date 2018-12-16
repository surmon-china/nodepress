import { Controller, Get, Put, Post, Body, UseGuards, HttpStatus } from '@nestjs/common';
import { HttpProcessor } from '@app/decorators/http.decorator';
import { JwtAuthGuard } from '@app/guards/auth.guard';
import { AuthService } from './auth.service';
import { ITokenResult } from './auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('admin')
  @HttpProcessor.handle('获取个人数据')
  async getAdminInfo(): Promise<any> {
    return await this.authService.getAdminInfo();
  }

  @Put('admin')
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('获取个人数据')
  async putAdminInfo() {
    // This route is restricted by AuthGuard
    // JWT strategy
  }

  @Post('login')
  @HttpProcessor.handle({ message: '登陆', success: HttpStatus.OK })
  createToken(@Body() { password }): ITokenResult {
    return this.authService.createToken(password);
  }

  // 检测 Token 有效性
  @Post('check')
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle({ message: '检测 Token ', success: HttpStatus.OK })
  checkToken(): string {
    return 'ok';
  }
}