import { Module } from '@nestjs/common';
import { AnnouncementController } from './announcement.controller';
import { AnnouncementService } from './announcement.service';

@Module({
  controllers: [AnnouncementController],
  providers: [AnnouncementService],
  exports: [AnnouncementService],
})
export class AnnouncementModule {}
