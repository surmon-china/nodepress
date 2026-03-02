/**
 * @file Webhook event listeners
 * @module module/webhook/listener
 * @author Surmon <https://github.com/surmon-china>
 */

import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { EventKeys } from '@app/constants/events.constant'
import { Option } from '@app/modules/options/options.model'
import { ArticlePopulated } from '@app/modules/article/article.model'
import { ArticleStatus } from '@app/modules/article/article.constant'
import { ArticleService } from '@app/modules/article/article.service'
import { WebhookService } from './webhook.service'
import { WebhookEvent } from './webhook.constant'

@Injectable()
export class WebhookListener {
  constructor(
    private readonly webhookService: WebhookService,
    private readonly articleService: ArticleService
  ) {}

  @OnEvent(EventKeys.OptionsUpdated, { async: true })
  async handleOptionsUpdated(options: Option) {
    await this.webhookService.dispatch(WebhookEvent.UpsertOptions, options)
  }

  @OnEvent(EventKeys.ArticleCreated, { async: true })
  @OnEvent(EventKeys.ArticleUpdated, { async: true })
  async handleArticleUpsert(article: ArticlePopulated) {
    if (article.status === ArticleStatus.Published) {
      await this.webhookService.dispatch(WebhookEvent.UpsertArticles, [article])
    } else {
      await this.webhookService.dispatch(WebhookEvent.DeleteArticles, [article.id])
    }
  }

  @OnEvent(EventKeys.ArticlesStatusChanged, { async: true })
  async handleArticlesStatusChange(payload: { articleIds: number[]; status: ArticleStatus }) {
    if (payload.status === ArticleStatus.Published) {
      const articles = await this.articleService.getListByIds(payload.articleIds)
      await this.webhookService.dispatch(WebhookEvent.UpsertArticles, articles)
    } else {
      await this.webhookService.dispatch(WebhookEvent.DeleteArticles, payload.articleIds)
    }
  }

  @OnEvent(EventKeys.ArticleDeleted, { async: true })
  async handleArticleDeleted(articleId: number) {
    await this.webhookService.dispatch(WebhookEvent.DeleteArticles, [articleId])
  }

  @OnEvent(EventKeys.ArticlesDeleted, { async: true })
  async handleArticlesDeleted(articleIds: number[]) {
    await this.webhookService.dispatch(WebhookEvent.DeleteArticles, articleIds)
  }
}
