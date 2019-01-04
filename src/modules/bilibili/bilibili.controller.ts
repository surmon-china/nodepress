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
  async getVideos(@QueryParams() { options: { page }}, @Query() { per_page }): Promise<IBilibiliVideoList> {
    return this.bilibiliService.isRequestDefaultList(per_page, page)
      ? this.bilibiliService.getVideoListCache()
      : this.bilibiliService.getVideoList(per_page, page);
  }
}
