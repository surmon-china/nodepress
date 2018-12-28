/**
 * Extended Giithub service.
 * @file Extended Giithub 模块服务
 * @module modules/extended/github.service
 * @author Surmon <https://github.com/surmon-china>
 */

import * as APP_CONFIG from '@app/app.config';
import { Injectable, HttpService } from '@nestjs/common';

export interface IBaiduSeoRepositorie {
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

@Injectable()
export class BaiduSeoService {
  constructor(private readonly httpService: HttpService) {}

  // POST request
  postRequest({ urlKey, urls, msg }) {
    this.httpService.axiosRef.request({
      method: 'post',
      body: urls,
      headers: { 'Content-Type': 'text/plain' },
      url: `http://data.zz.baidu.com/${urlKey}?site=${CONFIG.BAIDU.site}&token=${CONFIG.BAIDU.token}`,
    }).then(response => {
      console.info(urls, msg, response);
    }).catch(error => {
      const message = (error.response && error.response.data) || error;
      console.warn('项目列表获取失败：', message);
      return Promise.reject(message);
    });
  }

  // 提交记录
  baiduSeoPush = urls => {
    // console.log('百度推送：', urls)
    postRequest({ urls, urlKey: 'urls', msg: '百度推送结果：' });
  }

  // 更新记录
  baiduSeoUpdate = urls => {
    // console.log('百度更新：', urls)
    postRequest({ urls, urlKey: 'update', msg: '百度更新结果：' });
  }

  // 删除记录
  baiduSeoDelete = urls => {
    // console.log('百度删除：', urls)
    postRequest({ urls, urlKey: 'del', msg: '百度删除结果：' });
  }
}
