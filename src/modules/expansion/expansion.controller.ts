/**
 * Expansion controller.
 * @file 扩展模块控制器
 * @description 分发 -> 统计/常量/七牛/github/数据库备份
 * @module module/expansion/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import { Credentials } from 'google-auth-library';
import { Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@app/guards/auth.guard';
import { HttpProcessor } from '@app/decorators/http.decorator';
import { QiniuService, IUpToken } from '@app/processors/helper/helper.service.qiniu';
import { GoogleService } from '@app/processors/helper/helper.service.google';
import { GithubService, IGithubRepositorie } from './expansion.service.github';
import { StatisticService, ITodayStatistic } from './expansion.service.statistic';
import { DBBackupcService } from './expansion.service.dbbackup';

@Controller('expansion')
export class ExpansionController {

  constructor(
    private readonly githubService: GithubService,
    private readonly qiniuService: QiniuService,
    private readonly googleService: GoogleService,
    private readonly statisticService: StatisticService,
    private readonly dbBackupcService: DBBackupcService,
  ) {}

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

  @Patch('database-backup')
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('更新数据库备份')
  updateDatabaseBackup(): Promise<void> {
    return this.dbBackupcService.backup();
  }

  @Get('google-token')
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('获取 Google Token ')
  getGoogleToken(): Promise<Credentials> {
    return this.googleService.getCredentials();
  }
}
