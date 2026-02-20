/**
 * @file Admin module
 * @module module/admin/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { Module } from '@nestjs/common'
import { AdminController } from './admin.controller'
import { AdminProvider } from './admin.model'
import { AdminService } from './admin.service'
import { AdminAuthTokenService } from './admin.service.token'
import { AdminListener } from './admin.listener'

@Module({
  controllers: [AdminController],
  providers: [AdminProvider, AdminService, AdminAuthTokenService, AdminListener],
  exports: [AdminService]
})
export class AdminModule {}
