/**
 * @file User account module
 * @module module/account
 * @author Surmon <https://github.com/surmon-china>
 */

import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'

// account data
import { UserModule } from '@app/modules/user/user.module'
import { VoteProvider } from '@app/modules/vote/vote.model'
import { CommentProvider } from '@app/modules/comment/comment.model'

// account auth
import { AccountAuthController } from './auth/auth.controller'
import { UserAuthTokenService } from './auth/auth.service.token'
import { UserAuthStateService } from './auth/auth.service.state'
import { GithubAuthService } from './auth/auth.service.github'
import { GoogleAuthService } from './auth/auth.service.google'

// account profile manage
import { AccountController } from './account.controller'
import { AccountIdentityService } from './account.service.identity'
import { AccountActivityService } from './account.service.activity'

@Module({
  imports: [HttpModule, UserModule],
  controllers: [AccountController, AccountAuthController],
  providers: [
    CommentProvider,
    VoteProvider,
    AccountIdentityService,
    AccountActivityService,
    UserAuthTokenService,
    UserAuthStateService,
    GithubAuthService,
    GoogleAuthService
  ]
})
export class AccountModule {}
