/**
 * @file Helper SEO service
 * @module module/helper/seo.service
 * @author Surmon <https://github.com/surmon-china>
 */

import * as APP_CONFIG from '@app/app.config'
import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { getMessageFromAxiosError } from '@app/transformers/error.transformer'
import { GoogleService } from './helper.service.google'
import logger from '@app/utils/logger'

// 提交器支持的操作行为
export type SeoURL = string
export type ActionURL = SeoURL | SeoURL[]
export enum SeoAction {
  Push = 'push',
  Update = 'update',
  Delete = 'delete',
}

const ActionNameMap = {
  [SeoAction.Push]: '提交',
  [SeoAction.Update]: '更新',
  [SeoAction.Delete]: '删除',
}

@Injectable()
export class SeoService {
  constructor(private readonly httpService: HttpService, private readonly googleService: GoogleService) {}

  // 百度服务
  private pingBaidu(action: SeoAction, urls: SeoURL[]): void {
    const urlKeyMap = {
      [SeoAction.Push]: 'urls',
      [SeoAction.Update]: 'update',
      [SeoAction.Delete]: 'del',
    }
    const urlKey = urlKeyMap[action]
    const actionText = `百度 ping [${ActionNameMap[action]}] 操作`

    this.httpService.axiosRef
      .request({
        method: 'post',
        data: urls.join('\n'),
        headers: { 'Content-Type': 'text/plain' },
        url: `http://data.zz.baidu.com/${urlKey}?site=${APP_CONFIG.BAIDU_INDEXED.site}&token=${APP_CONFIG.BAIDU_INDEXED.token}`,
      })
      .then((response) => {
        logger.info(`[SEO]`, `${actionText}成功：`, urls, response.statusText)
      })
      .catch((error) => {
        logger.warn(`[SEO]`, `${actionText}失败：`, getMessageFromAxiosError(error))
      })
  }

  // Google 服务
  private pingGoogle(action: SeoAction, urls: SeoURL[]): void {
    const pingActionMap = {
      [SeoAction.Push]: 'URL_UPDATED',
      [SeoAction.Update]: 'URL_UPDATED',
      [SeoAction.Delete]: 'URL_DELETED',
    }
    const [url] = urls
    const type = pingActionMap[action]
    const actionText = `Google ping [${ActionNameMap[action]}] 操作`

    this.googleService
      .getCredentials()
      .then((credentials) => {
        return this.httpService.axiosRef
          .request({
            method: 'post',
            data: { url, type },
            headers: {
              'Content-Type': 'application/json',
              Authorization: ' Bearer ' + credentials.access_token,
            },
            url: `https://indexing.googleapis.com/v3/urlNotifications:publish`,
          })
          .then((response) => {
            logger.info(`[SEO]`, `${actionText}成功：`, url, response.statusText)
          })
          .catch((error) => Promise.reject(getMessageFromAxiosError(error)))
      })
      .catch((error) => {
        logger.warn(`[SEO]`, `${actionText}失败：`, error)
      })
  }

  private humanizedUrl(url: ActionURL): SeoURL[] {
    return typeof url === 'string' ? [url] : url
  }

  // 提交记录
  public push(url: ActionURL) {
    const urls = this.humanizedUrl(url)
    this.pingBaidu(SeoAction.Push, urls)
    this.pingGoogle(SeoAction.Push, urls)
  }

  // 更新记录
  public update(url: ActionURL) {
    const urls = this.humanizedUrl(url)
    this.pingBaidu(SeoAction.Update, urls)
    this.pingGoogle(SeoAction.Update, urls)
  }

  // 删除记录
  public delete(url: ActionURL) {
    const urls = this.humanizedUrl(url)
    this.pingBaidu(SeoAction.Delete, urls)
    this.pingGoogle(SeoAction.Delete, urls)
  }
}
