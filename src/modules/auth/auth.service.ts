import * as APP_CONFIG from '@app/app.config';
import { isEqual as lodashIsEqual } from 'lodash';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ITokenResult } from './auth.interface';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  // 创建 Token
  createToken(password: string): ITokenResult {
    console.log('password', password);
    const accessToken = this.jwtService.sign({ data: APP_CONFIG.AUTH.data });
    return { accessToken, expiresIn: APP_CONFIG.AUTH.expiresIn };
  }

  // 验证数据正确性
  validateAuthData(payload: any): Promise<any> {
    const isVerified = lodashIsEqual(payload.data, APP_CONFIG.AUTH.data);
    return isVerified ? payload.data : null;
  }

  async getAdminInfo() {
    return { name: '你好' };
  }
}