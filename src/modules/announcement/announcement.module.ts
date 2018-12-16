import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { Announcement } from './announcement.modal';
import { AnnouncementService } from './announcement.service';
import { AnnouncementController } from './announcement.controller';

@Module({
  imports: [TypegooseModule.forFeature(Announcement)],
  controllers: [AnnouncementController],
  providers: [AnnouncementService],
  exports: [AnnouncementService],
})
export class AnnouncementModule {}
