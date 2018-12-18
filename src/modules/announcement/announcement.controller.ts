/**
 * Announcement controller.
 * @file 公告模块数据模型
 * @module modules/announcement/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import { PaginateResult, Types } from 'mongoose';
import { Controller, Get, Put, Post, Param, Body, UseGuards } from '@nestjs/common';
import { HumanizedJwtAuthGuard } from '@app/guards/humanized-auth.guard';
import { HttpProcessor } from '@app/decorators/http.decorator';
import { QueryParams } from '@app/decorators/query-params.decorator';
import { JwtAuthGuard } from '@app/guards/auth.guard';
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
    return await this.announcementService.getList(querys, options);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('添加公告')
  async createAnnouncement(@Body() announcement: Announcement): Promise<Announcement> {
    return await this.announcementService.createItem(announcement);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('修改公告')
  async putAnnouncement(@QueryParams() { params }, @Body() announcement: Announcement): Promise<any> {
    console.log('putAnnouncement params.id', params.id);
    return await this.announcementService.putItem(params.id, announcement);
  }
}