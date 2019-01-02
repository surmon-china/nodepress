/**
 * Bilibili controller.
 * @file Bilibili 模块控制器
 * @module module/bilibili/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import { Controller, Get, Query } from '@nestjs/common';
import { HttpProcessor } from '@app/decorators/http.decorator';
import { BilibiliService, IBilibiliVideoList } from './bilibili.service';

@Controller('bilibili')
export class BilibiliController {

  constructor(private readonly bilibiliService: BilibiliService) {}

  @Get('list')
  @HttpProcessor.handle('获取视频列表')
  async getVideos(@Query() { pageSize, page }): Promise<IBilibiliVideoList> {
    return this.bilibiliService.isRequestDefaultList(pageSize, page)
      ? this.bilibiliService.getVideoListCache()
      : this.bilibiliService.getVideoList(pageSize, page);
  }
}
