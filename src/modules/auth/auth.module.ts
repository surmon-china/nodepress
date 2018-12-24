/**
 * Auth module.
 * @file 权限与管理员模块
 * @module modules/auth/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypegooseModule } from 'nestjs-typegoose';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { Auth } from './auth.model';
import * as APP_CONFIG from '@app/app.config';

@Module({
  imports: [
    TypegooseModule.forFeature(Auth),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secretOrPrivateKey: APP_CONFIG.AUTH.jwtTokenSecret,
      signOptions: { expiresIn: APP_CONFIG.AUTH.expiresIn },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
