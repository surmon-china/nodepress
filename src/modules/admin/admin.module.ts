/**
 * @file Admin module
 * @module module/admin/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { Module } from '@nestjs/common'
import { AdminController } from './admin.controller'
import { AdminProvider } from './admin.model'
import { AdminService } from './admin.service'
import { AdminListener } from './admin.listener'

@Module({
  controllers: [AdminController],
  providers: [AdminService, AdminProvider, AdminListener],
  exports: [AdminService]
})
export class AdminModule {}
