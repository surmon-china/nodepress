/**
 * Utils Statistic service.
 * @file Utils Statistic 模块服务
 * @module modules/utils/statistic.service
 * @author Surmon <https://github.com/surmon-china>
 */

import * as CACHE_KEY from '@app/constants/cache.constant';
import * as schedule from 'node-schedule';
import { Injectable } from '@nestjs/common';
import { CacheService } from '@app/processors/cache/cache.service';
// const Article = require('np-model/article.model')
// const Comment = require('np-model/comment.model')

export interface ITodayStatistic {
  tags: number;
  views: number;
  articles: number;
  comments: number;
}

@Injectable()
export class StatisticService {

  private resultData: ITodayStatistic = {
    tags: null,
    views: null,
    articles: null,
    comments: null,
  };

  constructor(private readonly cacheService: CacheService) {
    schedule.scheduleJob('1 0 0 * * *', () => {
      this.cacheService.set(CACHE_KEY.TODAY_VIEWS, 0);
    });
  }

  getStatistic() {
    return Promise.all([
      this.getTagsCount(),
      this.getViewsCount(),
      this.getArticlesCount(),
      this.getCommentsCount(),
    ])
    .then(_ => this.resultData);
  }

  private getTagsCount(): Promise<number> {
    return this.cacheService.get(CACHE_KEY.TAGS).then(tags => {
      this.resultData.tags = tags;
      return tags;
    });
  }

  private getViewsCount(): Promise<number> {
    return this.cacheService.get(CACHE_KEY.TODAY_VIEWS).then(views => {
      this.resultData.views = views || 0;
      return views;
    });
  }

  private getArticlesCount(): Promise<number> {
    return Promise.resolve(100);
    // return Article.countDocuments({}, (err, count) => {
    //   this.resultData.articles = count;
    //   return count;
    // });
  }

  private getCommentsCount(): Promise<number> {
    return Promise.resolve(100);
    // return Comment.countDocuments({}, (err, count) => {
    //   this.resultData.comments = count;
    //   return count;
    // });
  }
}