/**
 * Extended Statistic service.
 * @file 扩展模块 Statistic 服务
 * @module module/extended/statistic.service
 * @author Surmon <https://github.com/surmon-china>
 */

import * as schedule from 'node-schedule';
import * as CACHE_KEY from '@app/constants/cache.constant';
import { InjectModel } from 'nestjs-typegoose';
import { Injectable } from '@nestjs/common';
import { TMongooseModel } from '@app/interfaces/mongoose.interface';
import { CacheService } from '@app/processors/cache/cache.service';
import { Article } from '@app/modules/article/article.model';
import { Comment } from '@app/modules/comment/comment.model';

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

  constructor(
    private readonly cacheService: CacheService,
    @InjectModel(Article) private readonly articleModel: TMongooseModel<Article>,
    @InjectModel(Comment) private readonly commentModel: TMongooseModel<Comment>,
  ) {
    // 每天 0 点数据清零
    schedule.scheduleJob('1 0 0 * * *', () => {
      this.cacheService.set(CACHE_KEY.TODAY_VIEWS, 0);
    });
  }

  public getStatistic() {
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
    return this.articleModel.countDocuments({}).then(count => {
      this.resultData.articles = count;
      return count;
    });
  }

  private getCommentsCount(): Promise<number> {
    return this.commentModel.countDocuments({}).then(count => {
      this.resultData.comments = count;
      return count;
    });
  }
}
