/**
 * @file Webhook service
 * @module module/webhook/service
 * @author Surmon <https://github.com/surmon-china>
 */

import { createHmac } from 'node:crypto'
import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { getMessageFromAxiosError } from '@app/transformers/error.transformer'
import { APP_BIZ, WEBHOOK } from '@app/app.config'
import { isDevEnv } from '@app/app.environment'
import { createLogger } from '@app/utils/logger'
import { WebhookEvent } from './webhook.constant'

const logger = createLogger({ scope: 'WebhookService', time: isDevEnv })

export interface WebhookPayload {
  event: WebhookEvent
  payload: any
  timestamp: number
}

@Injectable()
export class WebhookService {
  constructor(private readonly httpService: HttpService) {}

  public dispatch(event: WebhookEvent, payload: any): void {
    if (!WEBHOOK.endpoint || !WEBHOOK.secret) return

    const timestamp = Date.now()
    const postData: WebhookPayload = { event, payload, timestamp }
    const rawData = JSON.stringify(postData)
    const signature = createHmac('sha256', WEBHOOK.secret).update(rawData).digest('hex')

    logger.log(`Dispatching event: ${event}...`)

    this.httpService.axiosRef
      .post(WEBHOOK.endpoint, postData, {
        timeout: 15000,
        headers: {
          'X-Webhook-Signature': signature,
          'X-Webhook-Timestamp': timestamp.toString(),
          'User-Agent': `${APP_BIZ.NAME}-Webhook-Service`
        }
      })
      .then((result) => {
        logger.success(`Event [${event}] dispatched successfully.`, result.data.message ?? result.data)
      })
      .catch((error) => {
        logger.failure(`Event [${event}] dispatch failed!`, getMessageFromAxiosError(error))
      })
  }
}
