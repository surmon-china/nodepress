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
import * as CACHE_KEY from '@app/constants/cache.constant'
import logger from '@app/utils/logger'

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
  private resultData: Statistic = { ...DEFAULT_STATISTIC }

  constructor(
    private readonly cacheService: CacheService,
    private readonly articleService: ArticleService,
    private readonly commentService: CommentService,
    private readonly feedbackService: FeedbackService,
    private readonly tagService: TagService
  ) {
    // clear date when everyday 00:00
    schedule.scheduleJob('1 0 0 * * *', () => {
      this.cacheService.set(CACHE_KEY.TODAY_VIEWS, 0).catch((error) => {
        logger.warn('[expansion]', 'statistic set TODAY_VIEWS Error:', error)
      })
    })
  }

  private async getTodayViewsCount() {
    const views = await this.cacheService.get<number>(CACHE_KEY.TODAY_VIEWS)
    this.resultData.todayViews = views || 0
  }

  private async getArticlesStatistic() {
    const meta = await this.articleService.getMetaStatistic()
    this.resultData.totalViews = meta.totalViews
    this.resultData.totalLikes = meta.totalLikes
  }

  private async getArticlesCount(publicOnly: boolean) {
    this.resultData.articles = await this.articleService.getTotalCount(publicOnly)
  }

  private async getTagsCount() {
    this.resultData.tags = await this.tagService.getTotalCount()
  }

  private async getCommentsCount(publicOnly: boolean) {
    this.resultData.comments = await this.commentService.getTotalCount(publicOnly)
  }

  private async getAverageEmotion() {
    this.resultData.averageEmotion = await this.feedbackService.getRootFeedbackAverageEmotion()
  }

  public getStatistic(publicOnly: boolean) {
    return Promise.all([
      this.getTagsCount(),
      this.getArticlesCount(publicOnly),
      this.getCommentsCount(publicOnly),
      this.getAverageEmotion(),
      this.getArticlesStatistic(),
      this.getTodayViewsCount(),
    ])
      .then(() => Promise.resolve(this.resultData))
      .catch(() => Promise.resolve(this.resultData))
  }
}
