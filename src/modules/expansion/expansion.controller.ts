/**
 * Expansion controller.
 * @file 扩展模块控制器
 * @description 分发 -> 统计/常量/七牛/github
 * @module module/expansion/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import * as CACHE_KEY from '@app/constants/cache.constant';
import * as STATE_CONSTANTS from '@app/interfaces/state.interface';
import { Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@app/guards/auth.guard';
import { HttpProcessor } from '@app/decorators/http.decorator';
import { HttpCache } from '@app/decorators/cache.decorator';
import { QiniuService, IUpToken } from '@app/processors/helper/helper.service.qiniu';
import { GithubService, IGithubRepositorie } from './expansion.service.github';
import { StatisticService, ITodayStatistic } from './expansion.service.statistic';

@Controller('expansion')
export class ExpansionController {

  constructor(
    private readonly githubService: GithubService,
    private readonly qiniuService: QiniuService,
    private readonly statisticService: StatisticService,
  ) {}

  @Get('constant')
  @HttpCache(CACHE_KEY.CONSTANTS, 60 * 60)
  @HttpProcessor.handle('获取配置常量')
  getSystemConstants(): object {
    return STATE_CONSTANTS;
  }

  @Get('statistic')
  @HttpProcessor.handle('获取统计概览')
  getSystemStatistics(): Promise<ITodayStatistic> {
    return this.statisticService.getStatistic();
  }

  @Get('github')
  @HttpProcessor.handle('获取项目列表')
  getGithubRepositories(): Promise<IGithubRepositorie[]> {
    return this.githubService.getRepositoriesCache();
  }

  @Patch('github')
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('更新项目列表缓存')
  updateGithubRepositories(): Promise<IGithubRepositorie[]> {
    return this.githubService.updateRepositoriesCache();
  }

  @Get('uptoken')
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('获取上传 Token')
  getQiniuUpToken(): IUpToken {
    return this.qiniuService.getToken();
  }
}
