/**
 * Github controller.
 * @file Github 控制器模块
 * @module module.github.controller
 * @author Surmon <https://github.com/surmon-china>
 */

import { Controller, Get } from '@nestjs/common';
import { CacheService } from '@app/processors/cache/cache.service';
import { GITHUB_REPOSITORIES } from '@app/constants/cache.constant';
import { GithubService } from './github.service';
import { IGithubRepositorie } from './github.interface';
import HttpProcessor from '@app/processors/decorators/http.decorator';

@Controller('github')
export class GithubController {

  // 项目列表缓存
  private repositoriesCache: any = null;

  constructor(private readonly githubService: GithubService, private readonly cacheService: CacheService) {

    this.repositoriesCache = this.cacheService.interval({
      key: GITHUB_REPOSITORIES,
      timeout: {
        success: 1000 * 60 * 60, // 成功后 1 小时更新一次数据
        error: 1000 * 60 * 5, // 失败后 5 分钟更新一次数据
      },
      promise: this.githubService.getRepositories,
    });
  }

  @Get()
  @HttpProcessor.handle('获取项目列表')
  async getRepositories(): Promise<IGithubRepositorie[]> {
    return await this.repositoriesCache();
  }
}
