/**
 * @file Webhook event listeners
 * @module module/webhook/listener
 * @author Surmon <https://github.com/surmon-china>
 */

import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { EventKeys } from '@app/constants/events.constant'
import { Option } from '@app/modules/options/options.model'
import { Article } from '@app/modules/article/article.model'
import { WebhookService } from './webhook.service'

@Injectable()
export class WebhookListener {
  constructor(private readonly webhookService: WebhookService) {}

  @OnEvent(EventKeys.OptionsUpdated, { async: true })
  handleOptionsUpdated(payload: Option) {
    return this.webhookService.dispatch(EventKeys.OptionsUpdated, payload)
  }

  @OnEvent(EventKeys.ArticleCreated, { async: true })
  handleArticleCreated(payload: Article) {
    return this.webhookService.dispatch(EventKeys.ArticleCreated, { id: payload.id })
  }

  @OnEvent(EventKeys.ArticleUpdated, { async: true })
  handleArticleUpdated(payload: Article) {
    return this.webhookService.dispatch(EventKeys.ArticleUpdated, { id: payload.id })
  }

  @OnEvent(EventKeys.ArticleDeleted, { async: true })
  handleGeneralEvents(payload: Article) {
    return this.webhookService.dispatch(EventKeys.ArticleDeleted, { id: payload.id })
  }
}
