/**
 * Auth module.
 * @file 权限与管理员模块
 * @module module/auth/module
 * @author Surmon <https://github.com/surmon-china>
 */

import jwt from 'jsonwebtoken';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthProvider } from './auth.model';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import * as APP_CONFIG from '@app/app.config';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      privateKey: APP_CONFIG.AUTH.jwtTokenSecret as jwt.Secret,
      signOptions: {
        expiresIn: APP_CONFIG.AUTH.expiresIn as number,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthProvider, AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
