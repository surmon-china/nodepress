import { Controller, Get, Put, Post, Body, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from '@app/guards/auth.guard';
import { AnnouncementService } from './announcement.service';
import { IAnnouncement } from './announcement.interface';
import { CreateAnnouncementDto } from './announcement.dto';
import HttpProcessor from '@app/processors/decorators/http.decorator';

@Controller('announcement')
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @Get()
  @HttpProcessor.handle('获取公告')
  async getAdminInfo(@Query() query): Promise<any> {
    return await this.announcementService.findAll(query);
  }

  @Post()
  @HttpProcessor.handle('添加公告')
  createToken(@Body() createAnnouncementDto: CreateAnnouncementDto) {
    return this.announcementService.create(createAnnouncementDto);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('修改公告')
  async putAdminInfo() {
    // This route is restricted by AuthGuard
    // JWT strategy
  }
}