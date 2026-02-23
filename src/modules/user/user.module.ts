/**
 * @file User module
 * @module module/user/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { UserController } from './user.controller'
import { UserProvider } from './user.model'
import { UserListener } from './user.listener'
import { UserService } from './user.service'

@Module({
  imports: [HttpModule],
  controllers: [UserController],
  providers: [UserProvider, UserService, UserListener],
  exports: [UserService]
})
export class UserModule {}
