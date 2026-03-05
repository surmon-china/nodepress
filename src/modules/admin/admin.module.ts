/**
 * @file Admin module
 * @module module/admin/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { Module } from '@nestjs/common'
import { AdminController } from './admin.controller'
import { AdminProvider } from './admin.model'
import { AdminProfileService } from './admin.service.profile'
import { AdminAuthService } from './admin.service.auth'
import { AdminListener } from './admin.listener'

@Module({
  controllers: [AdminController],
  providers: [AdminProvider, AdminProfileService, AdminAuthService, AdminListener],
  exports: [AdminProfileService]
})
export class AdminModule {}
