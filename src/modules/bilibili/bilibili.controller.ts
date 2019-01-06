/**
 * Bilibili controller.
 * @file Bilibili 模块控制器
 * @module module/bilibili/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import { Controller, Get, Query } from '@nestjs/common';
import { HttpProcessor } from '@app/decorators/http.decorator';
import { BilibiliService, IBilibiliVideoList } from './bilibili.service';
import { QueryParams, EQueryParamsField as QueryField } from '@app/decorators/query-params.decorator';

@Controller('bilibili')
export class BilibiliController {

  constructor(private readonly bilibiliService: BilibiliService) {}

  @Get('list')
  @HttpProcessor.handle('获取视频列表')
  getBilibiliVideos(@QueryParams() { options: { page, limit }}): Promise<IBilibiliVideoList> {
    return this.bilibiliService.isRequestDefaultList(limit, page)
      ? this.bilibiliService.getVideoListCache()
      : this.bilibiliService.getVideoList(limit, page);
  }
}
