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
import { CacheService, ICacheIntervalResult } from '@app/processors/cache/cache.service';
import { ESortType, EPublicState, EPublishState } from '@app/interfaces/state.interface';
import { BaiduSeoService } from '@app/processors/helper/helper.service.baidu-seo';
import { Article, ArticleModel } from './article.model';

@Injectable()
export class ArticleService {

  // 热门文章列表缓存
  private hotArticleListCache: ICacheIntervalResult;

  constructor(
    private readonly cacheService: CacheService,
    private readonly sitemapService: SitemapService,
    private readonly baiduSeoService: BaiduSeoService,
    @InjectModel(ArticleModel) private readonly articleModel: TMongooseModel<Article>,
  ) {
    this.hotArticleListCache = this.cacheService.interval({
      timeout: {
        success: 1000 * 60 * 30, // 成功后 30 分钟更新一次数据
        error: 1000 * 60 * 5, // 失败后 5 分钟更新一次数据
      },
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
    return this.hotArticleListCache();
  }

  // 请求文章列表
  getList(querys, options): Promise<PaginateResult<Article>> {
    // 隐藏机密信息
    options.populate = ['category', 'tag'];
    options.select = '-password -content';
    return this.articleModel.paginate(querys, options).then(articles => {
      return articles;
    });
  }

  // 获取文章详情（管理员用）
  async getItemForAdmin(articleId: Types.ObjectId): Promise<Article> {
    return this.articleModel.findById(articleId);
  }

  // 获取文章详情（用户用）
  async getItemForUser(articleId: number): Promise<Article> {
    return this.articleModel
      .findOne({ id: articleId, state: EPublishState.Published, public: EPublicState.Public })
      .select('-password')
      .populate('category')
      .populate('tag')
      .exec()
      .then(article => {
        // 增加浏览量
        article.meta.views++;
        article.save();
        // 更新今日浏览缓存
        this.cacheService.get(CACHE_KEY.TODAY_VIEWS).then(views => {
          this.cacheService.set(CACHE_KEY.TODAY_VIEWS, (views || 0) + 1);
        });
        const resultArticle = article.toObject();
        // 获取相关文章
        return this.getRelatedArticles(resultArticle).then(articles => {
          return Object.assign(resultArticle, { related: articles });
        });
      });
  }

  // 获取相关文章
  private async getRelatedArticles(article: Article): Promise<Article[]> {
    return this.articleModel.find(
      {
        state: EPublishState.Published,
        public: EPublicState.Public,
        tag: { $in: article.tag.map(t => (t as any)._id) },
        category: { $in: article.category.map(c => (c as any)._id) },
      },
      'id title description thumb -_id',
    );
  }

  // 创建文章
  createItem(newArticle: Article): Promise<Article> {
    return new this.articleModel(newArticle).save().then(article => {
      this.baiduSeoService.push(this.buildSeoUrl(article.id));
      this.sitemapService.updateSitemap();
      return article;
    });
  }

  // 修改文章
  async putItem(articleId: Types.ObjectId, newArticle: Article): Promise<Article> {
    // 修正信息
    Reflect.deleteProperty(newArticle, 'meta');
    Reflect.deleteProperty(newArticle, 'create_at');
    Reflect.deleteProperty(newArticle, 'update_at');
    return this.articleModel.findByIdAndUpdate(articleId, newArticle, { new: true }).then(article => {
      this.baiduSeoService.update(this.buildSeoUrl(article.id));
      this.sitemapService.updateSitemap();
      return article;
    });
  }

  // 批量更新
  async patchList(articls: Types.ObjectId[], state: EPublishState): Promise<any> {
    return this.articleModel.updateMany({ _id: { $in: articls }}, { $set: { state }}, { multi: true })
      .then(result => {
        this.sitemapService.updateSitemap();
        return result;
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
