/**
 * @file Article service
 * @module module/article/service
 * @author Surmon <https://github.com/surmon-china>
 */

import lodash from 'lodash'
import { Types } from 'mongoose'
import { DocumentType } from '@typegoose/typegoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@app/transformers/model.transformer'
import { getArticleUrl } from '@app/transformers/urlmap.transformer'
import { SeoService } from '@app/processors/helper/helper.service.seo'
import { CacheService, CacheIntervalResult } from '@app/processors/cache/cache.service'
import { ArchiveService } from '@app/modules/archive/archive.service'
import { TagService } from '@app/modules/tag/tag.service'
import { MongooseModel } from '@app/interfaces/mongoose.interface'
import { PaginateResult, PaginateOptions } from '@app/utils/paginate'
import { SortType, PublicState, PublishState } from '@app/interfaces/biz.interface'
import { Article, getDefaultMeta } from './article.model'
import * as CACHE_KEY from '@app/constants/cache.constant'

export const COMMON_USER_QUERY_PARAMS = Object.freeze({
  state: PublishState.Published,
  public: PublicState.Public,
})

@Injectable()
export class ArticleService {
  // 热门文章列表缓存
  private hotArticleListCache: CacheIntervalResult<PaginateResult<Article>>

  constructor(
    private readonly tagService: TagService,
    private readonly cacheService: CacheService,
    private readonly archiveService: ArchiveService,
    private readonly seoService: SeoService,
    @InjectModel(Article) private readonly articleModel: MongooseModel<Article>
  ) {
    this.hotArticleListCache = this.cacheService.interval({
      timeout: {
        success: 1000 * 60 * 30, // 成功后 30 分钟更新一次数据
        error: 1000 * 60 * 5, // 失败后 5 分钟更新一次数据
      },
      key: CACHE_KEY.HOT_ARTICLES,
      promise: () => {
        return this.getList.bind(this)(COMMON_USER_QUERY_PARAMS, {
          perPage: 10,
          sort: this.getHotSortOption(),
        })
      },
    })
  }

  // 热门文章列表缓存
  public getUserHotListCache(): Promise<PaginateResult<Article>> {
    return this.hotArticleListCache()
  }

  // 获取目标文章的相关文章
  private async getRelatedArticles(article: Article): Promise<Article[]> {
    return this.articleModel
      .find(
        {
          ...COMMON_USER_QUERY_PARAMS,
          tag: { $in: article.tag.map((t) => (t as any)._id) },
          category: { $in: article.category.map((c) => (c as any)._id) },
        },
        'id title description thumb meta create_at update_at -_id'
      )
      .exec()
  }

  // 得到热门排序配置
  public getHotSortOption() {
    return {
      'meta.comments': SortType.Desc,
      'meta.likes': SortType.Desc,
    }
  }

  // 请求文章列表
  public getList(querys, options: PaginateOptions): Promise<PaginateResult<Article>> {
    return this.articleModel.paginate(querys, {
      populate: ['category', 'tag'],
      select: '-password -content',
      ...options,
    })
  }

  // 获取文章详情（使用 ObjectId）
  public getDetailByObjectId(articleID: Types.ObjectId): Promise<Article> {
    return this.articleModel.findById(articleID).exec()
  }

  // 获取文章详情（使用数字 ID）
  public getDetailByNumberId(articleID: number): Promise<DocumentType<Article>> {
    return this.articleModel
      .findOne({
        id: articleID,
        ...COMMON_USER_QUERY_PARAMS,
      })
      .select('-password')
      .populate(['category', 'tag'])
      .exec()
  }

  // 获取全面的文章详情（用户用）
  public async getFullDetailForUser(articleID: number): Promise<Article> {
    const article = await this.getDetailByNumberId(articleID)

    // 如果文章不存在，返回 404
    if (!article) {
      throw '文章不存在'
    }

    // 增加浏览量
    article.meta.views++
    article.save()

    // 更新今日浏览缓存
    this.cacheService.get<number>(CACHE_KEY.TODAY_VIEWS).then((views) => {
      this.cacheService.set(CACHE_KEY.TODAY_VIEWS, (views || 0) + 1)
    })

    // 获取相关文章
    const articleObject = article.toObject() as Article
    const relatedArticles = await this.getRelatedArticles(articleObject)
    return Object.assign(articleObject, {
      related: lodash.sampleSize(relatedArticles, 12),
    })
  }

  // 创建文章
  public async create(newArticle: Article): Promise<Article> {
    const article = await this.articleModel.create({
      ...newArticle,
      meta: getDefaultMeta(),
    })
    this.seoService.push(getArticleUrl(article.id))
    this.archiveService.updateCache()
    this.tagService.updateListCache()
    return article
  }

  // 修改文章
  public async update(articleID: Types.ObjectId, newArticle: Article): Promise<Article> {
    // 修正信息
    Reflect.deleteProperty(newArticle, 'meta')
    Reflect.deleteProperty(newArticle, 'create_at')
    Reflect.deleteProperty(newArticle, 'update_at')

    const article = await this.articleModel.findByIdAndUpdate(articleID, newArticle as any, { new: true }).exec()
    this.seoService.update(getArticleUrl(article.id))
    this.archiveService.updateCache()
    this.tagService.updateListCache()
    return article
  }

  // 删除单个文章
  public async delete(articleID: Types.ObjectId): Promise<Article> {
    const article = await this.articleModel.findByIdAndRemove(articleID).exec()
    this.seoService.delete(getArticleUrl(article.id))
    this.archiveService.updateCache()
    this.tagService.updateListCache()
    return article
  }

  // 批量更新状态
  public async batchPatchState(articleIDs: Types.ObjectId[], state: PublishState) {
    const actionResult = await this.articleModel
      .updateMany({ _id: { $in: articleIDs } }, { $set: { state } }, { multi: true })
      .exec()
    this.archiveService.updateCache()
    this.tagService.updateListCache()
    return actionResult
  }

  // 批量删除文章
  public async batchDelete(articleIDs: Types.ObjectId[]) {
    const articles = await this.articleModel.find({ _id: { $in: articleIDs } }).exec()
    this.seoService.delete(articles.map((article) => getArticleUrl(article.id)))

    const actionResult = await this.articleModel.deleteMany({
      _id: { $in: articleIDs },
    })
    this.archiveService.updateCache()
    this.tagService.updateListCache()
    return actionResult
  }
}
