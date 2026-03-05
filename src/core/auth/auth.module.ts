/**
 * @file Global Auth module
 * @module core/auth/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { JwtModule } from '@nestjs/jwt'
import { Module, Global } from '@nestjs/common'
import { AuthAccessTokenService } from './auth.service.access-token'
import { AuthRefreshTokenService } from './auth.service.refresh-token'
import { APP_AUTH } from '@app/app.config'

@Global()
@Module({
  imports: [
    // https://docs.nestjs.com/security/authentication#jwt-token
    JwtModule.register({
      global: true,
      secret: APP_AUTH.jwtSecret,
      signOptions: {
        algorithm: 'HS256',
        issuer: APP_AUTH.jwtIssuer,
        audience: APP_AUTH.jwtAudience
      },
      verifyOptions: {
        issuer: APP_AUTH.jwtIssuer,
        audience: APP_AUTH.jwtAudience
      }
    })
  ],
  providers: [AuthAccessTokenService, AuthRefreshTokenService],
  exports: [AuthAccessTokenService, AuthRefreshTokenService]
})
export class AuthModule {}
