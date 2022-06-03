/**
 * @file SEO service
 * @module module/helper/seo.service
 * @author Surmon <https://github.com/surmon-china>
 */

import * as APP_CONFIG from '@app/app.config'
import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { getMessageFromAxiosError } from '@app/transformers/error.transformer'
import { GoogleService } from './helper.service.google'
import logger from '@app/utils/logger'

const log = logger.scope('SEO')

export type ActionURL = string | string[]
export enum SEOAction {
  Push = 'push',
  Update = 'update',
  Delete = 'delete',
}

@Injectable()
export class SeoService {
  constructor(private readonly httpService: HttpService, private readonly googleService: GoogleService) {}

  // Baidu https://ziyuan.baidu.com/linksubmit/index
  private pingBaidu(action: SEOAction, urls: string[]): void {
    this.httpService.axiosRef
      .request({
        method: 'post',
        data: urls.join('\n'),
        headers: { 'Content-Type': 'text/plain' },
        url: `http://data.zz.baidu.com/urls?site=${APP_CONFIG.BAIDU_INDEXED.site}&token=${APP_CONFIG.BAIDU_INDEXED.token}`,
      })
      .then((response) => {
        log.info(`Baidu ping [${action}] succeed.`, urls, response.statusText)
      })
      .catch((error) => {
        log.warn(`Baidu ping [${action}] failed!`, getMessageFromAxiosError(error))
      })
  }

  // Google
  private pingGoogle(action: SEOAction, urls: string[]): void {
    const pingActionMap = {
      [SEOAction.Push]: 'URL_UPDATED',
      [SEOAction.Update]: 'URL_UPDATED',
      [SEOAction.Delete]: 'URL_DELETED',
    }
    const [url] = urls
    const type = pingActionMap[action]
    const actionText = `Google ping [${action}] action`

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
            log.info(`${actionText} succeed.`, url, response.statusText)
          })
          .catch((error) => Promise.reject(getMessageFromAxiosError(error)))
      })
      .catch((error) => {
        log.warn(`${actionText} failed!`, error)
      })
  }

  private humanizedUrl(url: ActionURL): string[] {
    return typeof url === 'string' ? [url] : url
  }

  public push(url: ActionURL) {
    const urls = this.humanizedUrl(url)
    this.pingBaidu(SEOAction.Push, urls)
    this.pingGoogle(SEOAction.Push, urls)
  }

  public update(url: ActionURL) {
    const urls = this.humanizedUrl(url)
    this.pingBaidu(SEOAction.Update, urls)
    this.pingGoogle(SEOAction.Update, urls)
  }

  public delete(url: ActionURL) {
    const urls = this.humanizedUrl(url)
    this.pingBaidu(SEOAction.Delete, urls)
    this.pingGoogle(SEOAction.Delete, urls)
  }
}
