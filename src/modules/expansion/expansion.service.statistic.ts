/**
 * @file Expansion statistic service
 * @module module/expansion/statistic.service
 * @author Surmon <https://github.com/surmon-china>
 */

import schedule from 'node-schedule'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@app/transformers/model.transformer'
import { MongooseModel } from '@app/interfaces/mongoose.interface'
import { CacheService } from '@app/processors/cache/cache.service'
import { Article } from '@app/modules/article/article.model'
import { Comment } from '@app/modules/comment/comment.model'
import { Tag } from '@app/modules/tag/tag.model'
import * as CACHE_KEY from '@app/constants/cache.constant'
import logger from '@app/utils/logger'

export interface ITodayStatistic {
  tags: number | null
  views: number | null
  articles: number | null
  comments: number | null
}

@Injectable()
export class StatisticService {
  private resultData: ITodayStatistic = {
    tags: null,
    views: null,
    articles: null,
    comments: null,
  }

  constructor(
    private readonly cacheService: CacheService,
    @InjectModel(Tag) private readonly tagModel: MongooseModel<Tag>,
    @InjectModel(Article) private readonly articleModel: MongooseModel<Article>,
    @InjectModel(Comment) private readonly commentModel: MongooseModel<Comment>
  ) {
    // 每天 0 点数据清零
    schedule.scheduleJob('1 0 0 * * *', () => {
      this.cacheService.set(CACHE_KEY.TODAY_VIEWS, 0).catch((error) => {
        logger.warn('[expansion]', 'statistic set TODAY_VIEWS Error:', error)
      })
    })
  }

  private async getViewsCount() {
    const views = await this.cacheService.get<number>(CACHE_KEY.TODAY_VIEWS)
    this.resultData.views = views || 0
  }

  private async getTagsCount() {
    const count = await this.tagModel.countDocuments().exec()
    this.resultData.tags = count
  }

  private async getArticlesCount() {
    const count = await this.articleModel.countDocuments().exec()
    this.resultData.articles = count
  }

  private async getCommentsCount() {
    const count = await this.commentModel.countDocuments().exec()
    this.resultData.comments = count
  }

  public getStatistic() {
    return Promise.all([this.getTagsCount(), this.getViewsCount(), this.getArticlesCount(), this.getCommentsCount()])
      .then(() => Promise.resolve(this.resultData))
      .catch(() => Promise.resolve(this.resultData))
  }
}
