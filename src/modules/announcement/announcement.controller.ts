/**
 * Announcement controller.
 * @file 公告模块控制器
 * @module module/announcement/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import lodash from 'lodash';
import { PaginateResult } from 'mongoose';
import { Controller, Get, Put, Post, Delete, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@app/guards/auth.guard';
import { HumanizedJwtAuthGuard } from '@app/guards/humanized-auth.guard';
import { QueryParams, EQueryParamsField as QueryField } from '@app/decorators/query-params.decorator';
import { HttpProcessor } from '@app/decorators/http.decorator';
import { Announcement, DelAnnouncements } from './announcement.model';
import { AnnouncementService } from './announcement.service';

@Controller('announcement')
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @Get()
  @UseGuards(HumanizedJwtAuthGuard)
  @HttpProcessor.paginate()
  @HttpProcessor.handle('获取公告')
  getAnnouncements(@QueryParams([QueryField.State]) { querys, options, origin }): Promise<PaginateResult<Announcement>> {
    const keyword = lodash.trim(origin.keyword);
    if (keyword) {
      querys.content = new RegExp(keyword, 'i');
    }

    return this.announcementService.getList(querys, options);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('添加公告')
  createAnnouncement(@Body() announcement: Announcement): Promise<Announcement> {
    return this.announcementService.create(announcement);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('批量删除公告')
  delAnnouncements(@Body() body: DelAnnouncements) {
    return this.announcementService.batchDelete(body.announcement_ids);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('修改公告')
  putAnnouncement(@QueryParams() { params }, @Body() announcement: Announcement): Promise<Announcement> {
    return this.announcementService.update(params.id, announcement);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('删除单个公告')
  delAnnouncement(@QueryParams() { params }): Promise<Announcement> {
    return this.announcementService.delete(params.id);
  }
}
