/**
 * Utils controller.
 * @file Utils 模块控制器 -> 统计/常量/七牛/github
 * @module modules/utils/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import { Controller, Get, UseGuards } from '@nestjs/common';
import { GithubService, IGithubRepositorie } from './github.service';
import { QiniuService, IUpToken } from './qiniu.service';
import { StatisticService, ITodayStatistic } from './statistic.service';
import { HttpProcessor } from '@app/decorators/http.decorator';
import { HttpCache } from '@app/decorators/cache.decorator';
import { JwtAuthGuard } from '@app/guards/auth.guard';
import * as CACHE_KEY from '@app/constants/cache.constant';
import * as STATE_CONSTANTS from '@app/interfaces/state.interface';

@Controller('utils')
export class UtilsController {

  constructor(
    private readonly githubService: GithubService,
    private readonly qiniuService: QiniuService,
    private readonly statisticService: StatisticService,
  ) {}

  @Get('constants')
  @UseGuards(JwtAuthGuard)
  @HttpCache(CACHE_KEY.CONSTANTS, 60 * 60)
  @HttpProcessor.handle('获取配置常量')
  getConstants(): object {
    return STATE_CONSTANTS;
  }

  @Get('statistic')
  @HttpProcessor.handle('获取统计概览')
  async getStatistics(): Promise<ITodayStatistic> {
    return await this.statisticService.getStatistic();
  }

  @Get('github')
  @HttpProcessor.handle('获取项目列表')
  getRepositories(): Promise<IGithubRepositorie[]> {
    return this.githubService.getCache();
  }

  @Get('uptoken')
  @HttpProcessor.handle('获取上传 Token')
  getUpToken(): IUpToken {
    return this.qiniuService.getToken();
  }
}
