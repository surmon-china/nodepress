/**
 * Article service.
 * @file 文章模块数据服务
 * @module module/article/service
 * @author Surmon <https://github.com/surmon-china>
 */

import lodash from 'lodash';
import { DocumentType } from '@typegoose/typegoose';
import { PaginateResult, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@app/transformers/model.transformer';
import { getArticleUrl } from '@app/transformers/urlmap.transformer';
import { SeoService } from '@app/processors/helper/helper.service.seo';
import { CacheService, TCacheIntervalResult } from '@app/processors/cache/cache.service';
import { SyndicationService } from '@app/modules/syndication/syndication.service';
import { TagService } from '@app/modules/tag/tag.service';
import { MongooseModel } from '@app/interfaces/mongoose.interface';
import { ESortType, EPublicState, EPublishState } from '@app/interfaces/state.interface';
import { Article, getDefaultMeta } from './article.model';
import * as CACHE_KEY from '@app/constants/cache.constant';

export const COMMON_USER_QUERY_PARAMS = Object.freeze({
  state: EPublishState.Published,
  public: EPublicState.Public
})

@Injectable()
export class ArticleService {

  // 热门文章列表缓存
  private hotArticleListCache: TCacheIntervalResult<PaginateResult<Article>>;

  constructor(
    private readonly tagService: TagService,
    private readonly cacheService: CacheService,
    private readonly syndicationService: SyndicationService,
    private readonly seoService: SeoService,
    @InjectModel(Article) private readonly articleModel: MongooseModel<Article>,
  ) {
    this.hotArticleListCache = this.cacheService.interval({
      timeout: {
        success: 1000 * 60 * 30, // 成功后 30 分钟更新一次数据
        error: 1000 * 60 * 5, // 失败后 5 分钟更新一次数据
      },
      key: CACHE_KEY.HOT_ARTICLES,
      promise: () => {
        return this.getList.bind(this)(
          COMMON_USER_QUERY_PARAMS,
          {
            limit: 10,
            sort: this.getHotSortOption()
          }
        );
      },
    });
  }

  // 热门文章列表缓存
  public getUserHotListCache(): Promise<PaginateResult<Article>> {
    return this.hotArticleListCache();
  }

  // 获取目标文章的相关文章
  private async getRelatedArticles(article: Article): Promise<Article[]> {
    return this.articleModel.find(
      {
        ...COMMON_USER_QUERY_PARAMS,
        tag: { $in: article.tag.map(t => (t as any)._id) },
        category: { $in: article.category.map(c => (c as any)._id) },
      },
      'id title description thumb meta create_at update_at -_id',
    ).exec();
  }

  // 得到热门排序配置
  public getHotSortOption() {
    return {
      'meta.comments': ESortType.Desc,
      'meta.likes': ESortType.Desc,
    };
  }

  // 请求文章列表
  public getList(querys, options): Promise<PaginateResult<Article>> {
    options.populate = ['category', 'tag'];
    options.select = '-password -content';
    return this.articleModel.paginate(querys, options);
  }

  // 获取文章详情（使用 ObjectId）
  public getDetailByObjectId(articleId: Types.ObjectId): Promise<Article> {
    return this.articleModel.findById(articleId).exec();
  }

  // 获取文章详情（使用数字 ID）
  public getDetailByNumberId(articleId: number): Promise<DocumentType<Article>> {
    return this.articleModel
      .findOne({
        id: articleId,
        ...COMMON_USER_QUERY_PARAMS
      })
      .select('-password')
      .populate('category')
      .populate('tag')
      .exec();
  }

  // 获取全面的文章详情（用户用）
  public async getFullDetailForUser(articleId: number): Promise<Article> {
    const article = await this.getDetailByNumberId(articleId);

    // 如果文章不存在，返回 404
    if (!article) {
      throw '文章不存在';
    }

    // 增加浏览量
    article.meta.views++;
    article.save();

    // 更新今日浏览缓存
    this.cacheService.get<number>(CACHE_KEY.TODAY_VIEWS).then(views => {
      this.cacheService.set(CACHE_KEY.TODAY_VIEWS, (views || 0) + 1);
    });

    // 获取相关文章
    const articleObject = article.toObject() as Article;
    const relatedArticles = await this.getRelatedArticles(articleObject);
    return Object.assign(
      articleObject,
      { related: lodash.sampleSize(relatedArticles, 12) },
    );
  }

  // 创建文章
  public async create(newArticle: Article): Promise<Article> {
    const article = await this.articleModel.create({
      ...newArticle,
      meta: getDefaultMeta()
    });
    this.seoService.push(getArticleUrl(article.id));
    this.syndicationService.updateCache();
    this.tagService.updateListCache();
    return article;
  }

  // 修改文章
  public async update(articleId: Types.ObjectId, newArticle: Article): Promise<Article> {
    // 修正信息
    Reflect.deleteProperty(newArticle, 'meta');
    Reflect.deleteProperty(newArticle, 'create_at');
    Reflect.deleteProperty(newArticle, 'update_at');

    const article = await this.articleModel
      .findByIdAndUpdate(articleId, newArticle, { new: true })
      .exec();
    this.seoService.update(getArticleUrl(article.id));
    this.syndicationService.updateCache();
    this.tagService.updateListCache();
    return article;
  }

  // 删除单个文章
  public async delete(articleId: Types.ObjectId): Promise<Article> {
    const article = await this.articleModel
      .findByIdAndRemove(articleId)
      .exec();
    this.seoService.delete(getArticleUrl(article.id));
    this.syndicationService.updateCache();
    this.tagService.updateListCache();
    return article;
  }

  // 批量更新状态
  public async batchPatchState(articleIds: Types.ObjectId[], state: EPublishState) {
    const actionResult = await this.articleModel.updateMany(
      { _id: { $in: articleIds }},
      { $set: { state }},
      { multi: true }
    ).exec();
    this.syndicationService.updateCache();
    this.tagService.updateListCache();
    return actionResult;
  }

  // 批量删除文章
  public async batchDelete(articleIds: Types.ObjectId[]) {
    const articles = await this.articleModel
      .find({ _id: { $in: articleIds }})
      .exec();
    this.seoService.delete(
      articles.map(article => getArticleUrl(article.id))
    );

    const actionResult = await this.articleModel.deleteMany({ _id: { $in: articleIds }});
    this.syndicationService.updateCache();
    this.tagService.updateListCache();
    return actionResult;
  }
}
