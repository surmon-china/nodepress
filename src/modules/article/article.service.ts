/**
 * Article service.
 * @file 文章模块数据服务
 * @module module/article/service
 * @author Surmon <https://github.com/surmon-china>
 */

import * as APP_CONFIG from '@app/app.config';
import * as CACHE_KEY from '@app/constants/cache.constant';
import { Injectable } from '@nestjs/common';
import { PaginateResult, Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { TMongooseModel } from '@app/interfaces/mongoose.interface';
import { SitemapService } from '@app/modules/sitemap/sitemap.service';
import { TagService } from '@app/modules/tag/tag.service';
import { CacheService, ICacheIntervalResult } from '@app/processors/cache/cache.service';
import { ESortType, EPublicState, EPublishState } from '@app/interfaces/state.interface';
import { BaiduSeoService } from '@app/processors/helper/helper.service.baidu-seo';
import { Article } from './article.model';

@Injectable()
export class ArticleService {

  // 热门文章列表缓存
  private hotArticleListCache: ICacheIntervalResult<PaginateResult<Article>>;

  constructor(
    private readonly tagService: TagService,
    private readonly cacheService: CacheService,
    private readonly sitemapService: SitemapService,
    private readonly baiduSeoService: BaiduSeoService,
    @InjectModel(Article) private readonly articleModel: TMongooseModel<Article>,
  ) {
    this.hotArticleListCache = this.cacheService.interval({
      timeout: {
        success: 1000 * 60 * 30, // 成功后 30 分钟更新一次数据
        error: 1000 * 60 * 5, // 失败后 5 分钟更新一次数据
      },
      key: CACHE_KEY.TAGS,
      promise: () => {
        const options = { limit: 10, sort: this.getHotSortOption() };
        return this.getList.bind(this)(null, options, false);
      },
    });
  }

  // 构造链接
  private buildSeoUrl(id: string | number): string {
    return `${APP_CONFIG.APP.URL}/article/${id}`;
  }

  // 热门文章列表缓存
  public getHotListCache(): Promise<PaginateResult<Article>> {
    return this.hotArticleListCache();
  }

  // 获取目标文章的相关文章
  private async getRelatedArticles(article: Article): Promise<Article[]> {
    return this.articleModel.find(
      {
        state: EPublishState.Published,
        public: EPublicState.Public,
        tag: { $in: article.tag.map(t => (t as any)._id) },
        category: { $in: article.category.map(c => (c as any)._id) },
      },
      'id title description thumb -_id',
    ).exec();
  }

  // 得到热门排序配置
  public getHotSortOption(): object {
    return {
      'meta.comments': ESortType.Desc,
      'meta.likes': ESortType.Desc,
    };
  }

  // 请求文章列表
  public getList(querys, options): Promise<PaginateResult<Article>> {
    // 隐藏机密信息
    options.populate = ['category', 'tag'];
    options.select = '-password -content';
    return this.articleModel.paginate(querys, options);
  }

  // 获取文章详情（管理员用）
  public getDetailForAdmin(articleId: Types.ObjectId): Promise<Article> {
    return this.articleModel.findById(articleId).exec();
  }

  // 获取文章详情（用户用）
  public getDetailForUser(articleId: number): Promise<Article> {
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
        this.cacheService.get<number>(CACHE_KEY.TODAY_VIEWS).then(views => {
          this.cacheService.set(CACHE_KEY.TODAY_VIEWS, (views || 0) + 1);
        });
        // 获取相关文章
        const resultArticle = article.toObject();
        return this.getRelatedArticles(resultArticle).then(articles => {
          return Object.assign(resultArticle, { related: articles });
        });
      });
  }

  // 创建文章
  public create(newArticle: Article): Promise<Article> {
    newArticle = Object.assign({ meta: { likes: 0, views: 0, comments: 0 }}, newArticle);
    return new this.articleModel(newArticle).save().then(article => {
      this.baiduSeoService.push(this.buildSeoUrl(article.id));
      this.sitemapService.updateCache();
      this.tagService.updateListCache();
      return article;
    });
  }

  // 修改文章
  public update(articleId: Types.ObjectId, newArticle: Article): Promise<Article> {
    // 修正信息
    Reflect.deleteProperty(newArticle, 'meta');
    Reflect.deleteProperty(newArticle, 'create_at');
    Reflect.deleteProperty(newArticle, 'update_at');
    return this.articleModel
      .findByIdAndUpdate(articleId, newArticle, { new: true })
      .exec()
      .then(article => {
        this.baiduSeoService.update(this.buildSeoUrl(article.id));
        this.sitemapService.updateCache();
        this.tagService.updateListCache();
        return article;
      });
  }

  // 删除单个文章
  public delete(articleId: Types.ObjectId): Promise<Article> {
    return this.articleModel.findByIdAndRemove(articleId).exec().then(article => {
      this.baiduSeoService.delete(this.buildSeoUrl(article.id));
      this.sitemapService.updateCache();
      this.tagService.updateListCache();
      return article;
    });
  }

  // 批量更新状态
  public batchPatchState(articls: Types.ObjectId[], state: EPublishState): Promise<any> {
    return this.articleModel
      .updateMany({ _id: { $in: articls }}, { $set: { state }}, { multi: true })
      .exec()
      .then(result => {
        this.sitemapService.updateCache();
        this.tagService.updateListCache();
        return result;
      });
  }

  // 批量删除文章
  public batchDelete(articleIds: Types.ObjectId[]): Promise<any> {
    return this.articleModel.find({ _id: { $in: articleIds }}).exec().then(articles => {
      this.baiduSeoService.delete(articles.map(article => this.buildSeoUrl(article.id)));
      return this.articleModel.deleteMany({ _id: { $in: articleIds }}).then(result => {
        this.sitemapService.updateCache();
        this.tagService.updateListCache();
        return result;
      });
    });
  }
}
