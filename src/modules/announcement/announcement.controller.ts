import { Controller, Get, Put, Post, Body, UseGuards } from '@nestjs/common';
import { PaginateResult } from 'mongoose';
import { JwtAuthGuard } from '@app/guards/auth.guard';
import { HumanizedJwtAuthGuard } from '@app/guards/humanized-auth.guard';
import { HttpProcessor } from '@app/decorators/http.decorator';
import { QueryParams } from '@app/decorators/query-params.decorator';
import { Announcement } from './announcement.modal';
import { AnnouncementService } from './announcement.service';

@Controller('announcement')
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @Get()
  @UseGuards(HumanizedJwtAuthGuard)
  @HttpProcessor.paginate()
  @HttpProcessor.handle('获取公告')
  async getAnnouncements(@QueryParams() { querys, options, origin }): Promise<PaginateResult<Announcement>> {
    if (origin.keyword) {
      querys.content = new RegExp(origin.keyword);
    }
    return await this.announcementService.findAll(querys, options);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('添加公告')
  async createAnnouncement(@Body() createAnnouncementDto: Announcement): Promise<Announcement> {
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