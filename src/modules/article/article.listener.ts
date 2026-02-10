/**
 * @file Article event listeners
 * @module module/article/listener
 * @author Surmon <https://github.com/surmon-china>
 */

import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { CounterService } from '@app/core/helper/helper.service.counter'
import { EventKeys } from '@app/constants/events.constant'
import { CacheKeys } from '@app/constants/cache.constant'

@Injectable()
export class ArticleListener {
  constructor(private readonly counterService: CounterService) {}

  @OnEvent(EventKeys.ArticleViewed, { async: true })
  async handleArticleViewed(articleId: number) {
    this.counterService.incrementGlobalCount(CacheKeys.TodayViewCount)
  }
}
