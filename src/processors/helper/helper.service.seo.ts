/**
 * Helper Seo service.
 * @file Helper Seo 模块服务
 * @module module/helper/seo.service
 * @author Surmon <https://github.com/surmon-china>
 */

import * as APP_CONFIG from '@app/app.config';
import { Injectable, HttpService } from '@nestjs/common';
import { getMessageFromAxiosError } from '@app/transformers/error.transformer';
import { GoogleService } from './helper.service.google';

// 提交器支持的操作行为
export type TUrl = string;
export type TActionUrl = TUrl | TUrl[];
export enum ESeoAction {
  Push = 'push',
  Update = 'update',
  Delete = 'delete',
}

const ActionNameMap = {
  [ESeoAction.Push]: '提交',
  [ESeoAction.Update]: '更新',
  [ESeoAction.Delete]: '删除',
};

@Injectable()
export class SeoService {
  constructor(
    private readonly httpService: HttpService,
    private readonly googleService: GoogleService,
  ) {}

  // 百度服务
  private pingBaidu(action: ESeoAction, urls: TUrl[]): void {
    const urlKeyMap = {
      [ESeoAction.Push]: 'urls',
      [ESeoAction.Update]: 'update',
      [ESeoAction.Delete]: 'del',
    };
    const urlKey = urlKeyMap[action];
    const actionText = `百度 ping [${ActionNameMap[action]}] 操作`;

    this.httpService.axiosRef
      .request({
        method: 'post',
        data: urls.join('\n'),
        headers: { 'Content-Type': 'text/plain' },
        url: `http://data.zz.baidu.com/${urlKey}?site=${APP_CONFIG.BAIDU.site}&token=${APP_CONFIG.BAIDU.token}`,
      })
      .then(response => {
        console.info(`${actionText}成功：`, urls, response.statusText);
      })
      .catch(error => {
        console.warn(`${actionText}失败：`, getMessageFromAxiosError(error));
      });
  }

  // Google 服务
  private pingGoogle(action: ESeoAction, urls: TUrl[]): void {

    const pingActionMap = {
      [ESeoAction.Push]: 'URL_UPDATED',
      [ESeoAction.Update]: 'URL_UPDATED',
      [ESeoAction.Delete]: 'URL_DELETED',
    };
    const [url] = urls;
    const type = pingActionMap[action];
    const actionText = `Google ping [${ActionNameMap[action]}] 操作`;

    this.googleService.getCredentials()
      .then(credentials => {
        return this.httpService.axiosRef
          .request({
            method: 'post',
            data: { url, type },
            headers: {
              'Content-Type': 'application/json',
              'Authorization': ' Bearer ' + credentials.access_token,
            },
            url: `https://indexing.googleapis.com/v3/urlNotifications:publish`,
          })
          .then(response => {
            console.info(`${actionText}成功：`, url, response.statusText);
          })
          .catch(error => Promise.reject(getMessageFromAxiosError(error)));
      })
      .catch(error => {
        console.warn(`${actionText}失败：`, error);
      });
  }

  private humanizedUrl(url: TActionUrl): TUrl[] {
    return typeof url === 'string' ? [url] : url;
  }

  // 提交记录
  public push(url: TActionUrl) {
    const urls = this.humanizedUrl(url);
    this.pingBaidu(ESeoAction.Push, urls);
    this.pingGoogle(ESeoAction.Push, urls);
  }

  // 更新记录
  public update(url: TActionUrl) {
    const urls = this.humanizedUrl(url);
    this.pingBaidu(ESeoAction.Update, urls);
    this.pingGoogle(ESeoAction.Update, urls);
  }

  // 删除记录
  public delete(url: TActionUrl) {
    const urls = this.humanizedUrl(url);
    this.pingBaidu(ESeoAction.Delete, urls);
    this.pingGoogle(ESeoAction.Delete, urls);
  }
}
