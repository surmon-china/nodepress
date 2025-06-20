/**
 * @file Auth module
 * @module module/auth/module
 * @author Surmon <https://github.com/surmon-china>
 */

import type jwt from 'jsonwebtoken'
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { AuthController } from './auth.controller'
import { AdminProvider } from './auth.model'
import { AuthService } from './auth.service'
import { JwtStrategy } from './jwt.strategy'
import { APP_BIZ } from '@app/app.config'

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      privateKey: APP_BIZ.AUTH.jwtSecret as jwt.Secret,
      signOptions: {
        expiresIn: APP_BIZ.AUTH.expiresIn as number
      }
    })
  ],
  controllers: [AuthController],
  providers: [AdminProvider, AuthService, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}
