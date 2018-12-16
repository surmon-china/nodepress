/**
 * AnnouncementCtrl module.
 * @file 公告控制器模块
 * @module controller/announcement
 * @author Surmon <https://github.com/surmon-china>
 */

import * as APP_CONFIG from '@app/app.config';
import { Injectable, HttpService } from '@nestjs/common';
import { IGithubRepositorie } from './github.interface';

@Injectable()
export class GithubService {
  constructor(private readonly httpService: HttpService) {}
  getRepositories(): Promise<IGithubRepositorie[]> {
    return this.httpService.axiosRef.request({
      headers: { 'User-Agent': 'nodepress' },
      url: `http://api.github.com/users/${APP_CONFIG.GITHUB.username}/repos?per_page=1000`,
    })
    .then(response => {
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
        const errmsg = 'Github 控制器解析为 JSON 失败';
        console.warn(errmsg);
        return Promise.reject(errmsg);
      }
    })
    .catch(error => {
      const message = (error.response && error.response.data) || error;
      console.warn('项目列表获取失败', 'error:', message);
      return Promise.reject(message);
    });
  }
}