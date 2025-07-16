/**
 * @file Global Auth module
 * @module core/auth/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { Module, Global } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { APP_BIZ } from '@app/app.config'
import { AuthService } from './auth.service'

@Global()
@Module({
  imports: [
    // https://docs.nestjs.com/security/authentication#jwt-token
    JwtModule.register({
      global: true,
      secret: APP_BIZ.AUTH.jwtSecret,
      signOptions: { expiresIn: APP_BIZ.AUTH.expiresIn }
    })
  ],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}
