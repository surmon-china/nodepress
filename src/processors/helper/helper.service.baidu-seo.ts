/**
 * Helper BaiduSeo service.
 * @file Helper BaiduSeo 模块服务
 * @module module/helper/baidu-seo.service
 * @author Surmon <https://github.com/surmon-china>
 */

import * as APP_CONFIG from '@app/app.config';
import { Injectable, HttpService } from '@nestjs/common';

export enum EBaiduSeoActions {
  Push = 'push',
  Update = 'update',
  Delete = 'delete',
}

export type TUrl = string;
export type THumanizedUrl = TUrl | TUrl[];
export interface IBaiduSeoRequestOption {
  urlKey: string;
  urls: TUrl[];
  action: string;
}

@Injectable()
export class BaiduSeoService {
  constructor(private readonly httpService: HttpService) {}

  // POST 服务
  private baiduRequest(option: IBaiduSeoRequestOption): Promise<any> {
    const { urlKey, urls, action } = option;
    return this.httpService.axiosRef.request({
      method: 'post',
      data: urls.join('\n'),
      headers: { 'Content-Type': 'text/plain' },
      url: `http://data.zz.baidu.com/${urlKey}?site=${APP_CONFIG.BAIDU.site}&token=${APP_CONFIG.BAIDU.token}`,
    }).then(response => {
      console.info(`${action} 操作：`, urls, response);
      return response;
    }).catch(error => {
      const message = (error.response && error.response.data) || error;
      console.warn(`${action} 操作失败：`, message);
      return Promise.reject(message);
    });
  }

  private humanizedUrl(url: THumanizedUrl): TUrl[] {
    return typeof url === 'string' ? [url] : url;
  }

  // 提交记录
  push(url: THumanizedUrl) {
    this.baiduRequest({ urls: this.humanizedUrl(url), urlKey: 'urls', action: '百度推送' });
  }

  // 更新记录
  update(url: THumanizedUrl) {
    this.baiduRequest({ urls: this.humanizedUrl(url), urlKey: 'update', action: '百度更新' });
  }

  // 删除记录
  delete(url: THumanizedUrl) {
    this.baiduRequest({ urls: this.humanizedUrl(url), urlKey: 'del', action: '百度删除' });
  }
}
