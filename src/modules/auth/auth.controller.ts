import { Controller, Get, Put, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@app/guards/auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 获取个人资料
  @Get('admin')
  async getAdminInfo(): Promise<any> {
    return await this.authService.getAdminInfo();
  }

  // 修改用户资料和密码
  @Put('admin')
  @UseGuards(JwtAuthGuard)
  async putAdminInfo() {
    // This route is restricted by AuthGuard
    // JWT strategy
  }

  // 登陆
  @Post('login')
  async createToken() {
    return await this.authService.createToken();
  }

  // 检测 Token 有效性
  @Post('check')
  @UseGuards(JwtAuthGuard)
  async checkToken() {
    return 'ok';
  }
}