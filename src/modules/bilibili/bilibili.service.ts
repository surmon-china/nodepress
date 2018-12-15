/**
 * AnnouncementCtrl module.
 * @file 公告控制器模块
 * @module controller/announcement
 * @author Surmon <https://github.com/surmon-china>
 */

// const redis = require('np-core/np-redis');
// const { REDIS_CACHE_FIELDS } = require('np-core/np-constants');
import * as request from 'request';
import * as appConfig from '@app/app.config';
import { Injectable } from '@nestjs/common';
import { IGithubRepositorie } from './github.interface';
import { console } from '@app/transforms/module.transform';

@Injectable()
export class GithubService {
  constructor() {}

  getVideos(): Promise<IGithubRepositorie[]> {
    return new Promise((resolve, reject) => {
      request({
        headers: { 'User-Agent': 'request' },
        url: `https://space.bilibili.com/ajax/member/getSubmitVideos?mid=27940710&pagesize=30&tid=0&page=1&keyword=&order=pubdate`,
      }, (err, response, body) => {
        if (!err && response.statusCode === 200) {
          try {
            const peojects: IGithubRepositorie[] = JSON.parse(body).map(rep => {
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
              };
            });
            return resolve(peojects);
          } catch (error) {
            const errmsg = 'Github 控制器解析为 JSON 失败';
            console.warn(errmsg, body);
            return reject(errmsg);
          }
        } else {
          console.warn('项目列表获取失败', 'err:', err, 'body:', body);
          return reject(err || body);
        }
      });
    });
  }
}