/**
 * Extended Giithub service.
 * @file Extended Giithub 模块服务
 * @module modules/extended/github.service
 * @author Surmon <https://github.com/surmon-china>
 */

import * as APP_CONFIG from '@app/app.config';
import * as CACHE_KEY from '@app/constants/cache.constant';
import { Injectable, HttpService } from '@nestjs/common';
import { CacheService, ICacheIntervalResult } from '@app/processors/cache/cache.service';

export interface IGithubRepositorie {
  html_url: string;
  name: string;
  fork: boolean;
  forks: number;
  forks_count: number;
  description: string;
  open_issues_count: number;
  stargazers_count: number;
  created_at: string;
  language: string;
}

export interface IGithubOriginRepositorie {
  [key: string]: string | number;
}

@Injectable()
export class GithubService {

  private cache: ICacheIntervalResult;

  constructor(private readonly httpService: HttpService, private readonly cacheService: CacheService) {
    this.cache = this.cacheService.interval({
      key: CACHE_KEY.GITHUB_REPOSITORIES,
      promise: this.getRepositories.bind(this),
      timeout: {
        success: 1000 * 60 * 60, // 成功后 1 小时更新一次数据
        error: 1000 * 60 * 5, // 失败后 5 分钟更新一次数据
      },
    });
  }

  // 获取缓存
  getCache(): Promise<IGithubRepositorie[]> {
    return this.cache();
  }

  // 获取项目列表
  getRepositories(): Promise<IGithubRepositorie[]> {
    return this.httpService.axiosRef.request({
      headers: { 'User-Agent': APP_CONFIG.INFO.name },
      url: `http://api.github.com/users/${APP_CONFIG.GITHUB.username}/repos?per_page=1000`,
    }).then(response => {
      try {
        return response.data.map(rep => {
          return {
            html_url: rep.html_url,
            name: rep.name || ' ',
            fork: rep.fork,
            forks: rep.forks,
            forks_count: rep.forks_count,
            description: rep.description || ' ',
            open_issues_count: rep.open_issues_count,
            stargazers_count: rep.stargazers_count,
            created_at: rep.created_at,
            language: rep.language,
          } as IGithubRepositorie;
        });
      } catch (error) {
        return Promise.reject('Giithub 控制器解析为 JSON 失败' + error);
      }
    }).catch(error => {
      const message = (error.response && error.response.data) || error;
      console.warn('项目列表获取失败：', message);
      return Promise.reject(message);
    });
  }
}