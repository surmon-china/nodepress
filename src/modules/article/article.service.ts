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

  // 热门文章列表缓存
  private hotArticleListCache: TCachePromiseIoResult;

  constructor(
    private readonly cacheService: CacheService,
    private readonly sitemapService: SitemapService,
    private readonly baiduSeoService: BaiduSeoService,
    @InjectModel(ArticleModel) private readonly articleModel: TMongooseModel<Article>,
  ) {
    this.hotArticleListCache = this.cacheService.promise({
      ioMode: true,
      key: CACHE_KEY.TAGS,
      promise() {
        const options = {
          limit: 10,
          sort: {
            'meta.comments': ESortType.Desc,
            'meta.likes': ESortType.Desc,
          },
        };
        return this.getList.bind(this)(null, options, false);
      },
    });
  }

  // 构造链接
  private buildSeoUrl(id: string | number): string {
    return `${APP_CONFIG.APP.URL}/article/${id}`;
  }

  // 热门文章列表缓存
  getHotListCache(): Promise<PaginateResult<Article>> {
    return this.hotArticleListCache.get();
  }

  // 请求文章列表
  getList(querys, options): Promise<PaginateResult<Article>> {
    // 隐藏机密信息
    options.populate = ['category', 'article'];
    options.select = '-password -content';
    return this.articleModel.paginate(querys, options).then(articles => {
      return articles;
    });
  }

  // 创建文章
  createItem(newArticle: Article): Promise<Article> {
    return this.articleModel.find({ slug: newArticle.id }).then(existedArticles => {
      return existedArticles.length
        ? Promise.reject('slug 已被占用')
        : new this.articleModel(newArticle).save().then(article => {
            this.baiduSeoService.push(this.buildSeoUrl(article.id));
            this.sitemapService.updateSitemap();
            return article;
          });
    });
  }

  // 修改文章
  async putItem(articleId: Types.ObjectId, newArticle: Article): Promise<Article> {
    return this.articleModel.findOne({ slug: newArticle.id }).then(existedArticle => {
      return existedArticle && existedArticle._id !== articleId
        ? Promise.reject('slug 已被占用')
        : this.articleModel.findByIdAndUpdate(articleId, newArticle, { new: true }).then(article => {
            this.baiduSeoService.push(this.buildSeoUrl(article.id));
            this.sitemapService.updateSitemap();
            return article;
          });
    });
  }

  // 删除单个文章
  async deleteItem(articleId: Types.ObjectId): Promise<any> {
    return this.articleModel.findByIdAndRemove(articleId).then(article => {
      this.baiduSeoService.delete(this.buildSeoUrl(article.id));
      this.sitemapService.updateSitemap();
      return article;
    });
  }

  // 批量删除文章
  async deleteList(articleIds: Types.ObjectId[]): Promise<any> {
    return this.articleModel.find({ _id: { $in: articleIds }}).then(articles => {
      this.baiduSeoService.delete(articles.map(article => this.buildSeoUrl(article.id)));
      return this.articleModel.deleteMany({ _id: { $in: articleIds }}).then(result => {
        this.sitemapService.updateSitemap();
        return result;
      });
    });
  }
}
