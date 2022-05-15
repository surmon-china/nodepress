/**
 * @file Expansion statistic service
 * @module module/expansion/statistic.service
 * @author Surmon <https://github.com/surmon-china>
 */

import schedule from 'node-schedule'
import { Injectable } from '@nestjs/common'
import { CacheService } from '@app/processors/cache/cache.service'
import { ArticleService } from '@app/modules/article/article.service'
import { CommentService } from '@app/modules/comment/comment.service'
import { FeedbackService } from '@app/modules/feedback/feedback.service'
import { TagService } from '@app/modules/tag/tag.service'
import logger from '@app/utils/logger'
import { getTodayViewsCount, resetTodayViewsCount } from './expansion.helper'

const DEFAULT_STATISTIC = Object.freeze({
  tags: null,
  articles: null,
  comments: null,
  totalViews: null,
  totalLikes: null,
  todayViews: null,
  averageEmotion: null,
})

export type Statistic = Record<keyof typeof DEFAULT_STATISTIC, number | null>

@Injectable()
export class StatisticService {
  constructor(
    private readonly cacheService: CacheService,
    private readonly articleService: ArticleService,
    private readonly commentService: CommentService,
    private readonly feedbackService: FeedbackService,
    private readonly tagService: TagService
  ) {
    // clear date when everyday 00:00
    schedule.scheduleJob('1 0 0 * * *', () => {
      resetTodayViewsCount(this.cacheService).catch((error) => {
        logger.warn('[expansion]', 'statistic set TODAY_VIEWS Error:', error)
      })
    })
  }

  public getStatistic(publicOnly: boolean) {
    const resultData: Statistic = { ...DEFAULT_STATISTIC }
    return Promise.all([
      this.tagService.getTotalCount().then((value) => {
        resultData.tags = value
      }),
      this.articleService.getTotalCount(publicOnly).then((value) => {
        resultData.articles = value
      }),
      this.commentService.getTotalCount(publicOnly).then((value) => {
        resultData.comments = value
      }),
      this.articleService.getMetaStatistic().then((value) => {
        resultData.totalViews = value.totalViews
        resultData.totalLikes = value.totalLikes
      }),
      getTodayViewsCount(this.cacheService).then((value) => {
        resultData.todayViews = value
      }),
      this.feedbackService.getRootFeedbackAverageEmotion().then((value) => {
        resultData.averageEmotion = value
      }),
    ])
      .then(() => Promise.resolve(resultData))
      .catch(() => Promise.resolve(resultData))
  }
}
