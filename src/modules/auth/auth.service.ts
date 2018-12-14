import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AUTH } from '@app/app.config';
import { isEqual as lodashIsEqual } from 'lodash';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  // 创建 Token
  createToken() {
    const accessToken = this.jwtService.sign({ data: AUTH.data });
    return { accessToken, expiresIn: AUTH.expiresIn };
  }

  // 验证数据正确性
  validateAuthData(payload: any): Promise<any> {
    const isVerified = lodashIsEqual(payload.data, AUTH.data);
    return isVerified ? payload.data : null;
  }

  async getAdminInfo() {
    return { name: '你好' };
  }
}