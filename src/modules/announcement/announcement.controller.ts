import { Controller, Get, Put, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@app/guards/auth.guard';
import { HttpProcessor } from '@app/decorators/http.decorator';
import { Paginate } from '@app/decorators/paginate.decorator';
import { Announcement } from './announcement.modal';
import { AnnouncementService } from './announcement.service';

@Controller('announcement')
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @Get()
  @HttpProcessor.paginate()
  @HttpProcessor.handle('获取公告')
  async getAnnouncements(@Paginate() { query, options }): Promise<Announcement[]> {
    console.log('getAnnouncements paginate', query, options);
    return await this.announcementService.findAll(query, options);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('添加公告')
  async createAnnouncement(@Body() createAnnouncementDto: Announcement) {
    return await this.announcementService.create(createAnnouncementDto);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('修改公告')
  async putAdminInfo() {
    // This route is restricted by AuthGuard
    // JWT strategy
  }
}