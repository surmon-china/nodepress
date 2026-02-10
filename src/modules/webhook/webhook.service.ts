/**
 * @file Webhook service
 * @module module/webhook/service
 * @author Surmon <https://github.com/surmon-china>
 */

import _omit from 'lodash/omit'
import _uniq from 'lodash/uniq'
import { lastValueFrom } from 'rxjs'
import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { EventKeys } from '@app/constants/events.constant'
import { getMessageFromAxiosError } from '@app/transformers/error.transformer'
import { createLogger } from '@app/utils/logger'
import { isDevEnv } from '@app/app.environment'
import { APP_BIZ, WEBHOOK } from '@app/app.config'

const logger = createLogger({ scope: 'WebhookService', time: isDevEnv })

export interface WebhookData {
  event: EventKeys
  timestamp: number
  data: any
}

@Injectable()
export class WebhookService {
  constructor(private readonly httpService: HttpService) {}

  public dispatch(event: EventKeys, payload: any): void {
    if (!WEBHOOK.url) return

    const postData: WebhookData = {
      event,
      timestamp: Date.now(),
      data: payload
    }

    logger.log(`Dispatching event: ${event}...`)

    lastValueFrom(
      this.httpService.post(WEBHOOK.url, postData, {
        timeout: 15000,
        headers: {
          'X-Webhook-Token': WEBHOOK.token || '',
          'User-Agent': `${APP_BIZ.NAME}-Webhook-Service`
        }
      })
    )
      .then(() => {
        logger.success(`Event ${event} dispatched successfully.`)
      })
      .catch((error) => {
        logger.failure(`Event ${event} dispatch failed!`, getMessageFromAxiosError(error))
      })
  }
}
