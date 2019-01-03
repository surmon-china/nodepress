/**
 * Article service.
 * @file 文章模块数据服务
 * @module module/article/service
 * @author Surmon <https://github.com/surmon-china>
 */

import * as lodash from 'lodash';
import * as APP_CONFIG from '@app/app.config';
import * as CACHE_KEY from '@app/constants/cache.constant';
import { Injectable } from '@nestjs/common';
import { PaginateResult, Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { TMongooseModel } from '@app/interfaces/mongoose.interface';
import { SitemapService } from '@app/modules/sitemap/sitemap.service';
import { CacheService, TCachePromiseIoResult } from '@app/processors/cache/cache.service';
import { ESortType, EPublicState, EPublishState } from '@app/interfaces/state.interface';
import { BaiduSeoService } from '@app/processors/helper/helper.service.baidu-seo';
import { Article, ArticleModel } from './article.model';

@Injectable()
export class ArticleService {

  // 为非鉴权用户所用
  private articleListCache: TCachePromiseIoResult;

  constructor(
    private readonly cacheService: CacheService,
    private readonly sitemapService: SitemapService,
    private readonly baiduSeoService: BaiduSeoService,
    @InjectModel(ArticleModel) private readonly articleModel: TMongooseModel<Article>,
  ) {
    const promiseTask = () => {
      const options = { page: 1, limit: 166, sort: { _id: ESortType.Desc }};
      return this.getList.bind(this)(null, options, false);
    };
    this.articleListCache = this.cacheService.promise({
      ioMode: true,
      key: CACHE_KEY.TAGS,
      promise: promiseTask,
    });
  }

  // 构造链接
  private buildSeoUrl(slug: string): string {
    return `${APP_CONFIG.APP.URL}/article/${slug}`;
  }

  // 更新所有内容相关服务
  private updateContentExternalService(): void {
    this.updateListCache();
    this.sitemapService.updateSitemap();
  }

  // 请求文章列表缓存
  getListCache(): Promise<PaginateResult<Article>> {
    return this.articleListCache.get();
  }

  // 更新文章列表缓存
  updateListCache(): Promise<PaginateResult<Article>> {
    return this.articleListCache.update();
  }

  // 请求文章列表（及聚和数据）
  getList(querys, options, isAuthenticated): Promise<PaginateResult<Article>> {
    const matchState = { state: EPublishState.Published, public: EPublicState.Public };
    return this.articleModel.paginate(querys, options).then(articles => {
      return this.articleModel.aggregate([
        { $match: isAuthenticated ? null : matchState },
        { $unwind: '$article' },
        { $group: { _id: '$article', num_tutorial: { $sum: 1 }}},
      ]).then(counts => {
        const todoArticles = lodash.cloneDeep(articles);
        todoArticles.docs = todoArticles.docs.map(article => {
          const finded = counts.find(count => String(count._id) === String(article._id));
          article.count = finded ? finded.num_tutorial : 0;
          return article;
        });
        return todoArticles;
      });
    });
  }

  // 创建文章
  createItem(newArticle: Article): Promise<Article> {
    return this.articleModel.find({ slug: newArticle.slug }).then(existedArticles => {
      return existedArticles.length
        ? Promise.reject('slug 已被占用')
        : new this.articleModel(newArticle).save().then(article => {
            this.baiduSeoService.push(this.buildSeoUrl(article.slug));
            this.updateContentExternalService();
            return article;
          });
    });
  }

  // 修改文章
  async putItem(articleId: Types.ObjectId, newArticle: Article): Promise<Article> {
    return this.articleModel.findOne({ slug: newArticle.slug }).then(existedArticle => {
      return existedArticle && existedArticle._id !== articleId
        ? Promise.reject('slug 已被占用')
        : this.articleModel.findByIdAndUpdate(articleId, newArticle, { new: true }).then(article => {
            this.baiduSeoService.push(this.buildSeoUrl(article.slug));
            this.updateContentExternalService();
            return article;
          });
    });
  }

  // 删除单个文章
  async deleteItem(articleId: Types.ObjectId): Promise<any> {
    return this.articleModel.findByIdAndRemove(articleId).then(article => {
      this.baiduSeoService.delete(this.buildSeoUrl(article.slug));
      this.updateContentExternalService();
      return article;
    });
  }

  // 批量删除文章
  async deleteList(articleIds: Types.ObjectId[]): Promise<any> {
    return this.articleModel.find({ _id: { $in: articleIds }}).then(articles => {
      this.baiduSeoService.delete(articles.map(article => this.buildSeoUrl(article.slug)));
      return this.articleModel.deleteMany({ _id: { $in: articleIds }}).then(result => {
        this.updateContentExternalService();
        return result;
      });
    });
  }
}
