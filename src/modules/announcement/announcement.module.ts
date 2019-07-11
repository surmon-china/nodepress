/**
 * Announcement module.
 * @file 公告模块
 * @module module/announcement/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { Module } from '@nestjs/common';
import { AnnouncementProvider } from './announcement.model';
import { AnnouncementService } from './announcement.service';
import { AnnouncementController } from './announcement.controller';

@Module({
  controllers: [AnnouncementController],
  providers: [AnnouncementProvider, AnnouncementService],
  exports: [AnnouncementService],
})
export class AnnouncementModule {}
