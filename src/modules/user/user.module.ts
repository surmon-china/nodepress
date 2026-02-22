/**
 * @file User module
 * @module module/user/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'

// user CRUD
import { UserController } from './user.controller'
import { UserProvider } from './user.model'
import { UserListener } from './user.listener'
import { UserService } from './user.service'

// user auth
import { UserAuthController } from './auth/auth.controller'
import { UserAuthTokenService } from './auth/auth.service.token'
import { UserAuthStateService } from './auth/auth.service.state'
import { GithubAuthService } from './auth/auth.service.github'
import { GoogleAuthService } from './auth/auth.service.google'

// user manage
import { UserMeController } from './me/me.controller'
import { UserAccountService } from './me/me.service.account'
import { UserActivityService } from './me/me.service.activity'

// user data
import { CommentProvider } from '@app/modules/comment/comment.model'
import { VoteProvider } from '@app/modules/vote/vote.model'

@Module({
  imports: [HttpModule],
  controllers: [UserController, UserMeController, UserAuthController],
  providers: [
    CommentProvider,
    VoteProvider,
    UserProvider,
    UserService,
    UserListener,
    UserAccountService,
    UserActivityService,
    UserAuthTokenService,
    UserAuthStateService,
    GithubAuthService,
    GoogleAuthService
  ],
  exports: [UserService]
})
export class UserModule {}
