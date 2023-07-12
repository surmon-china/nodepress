/**
 * @file Article service
 * @module module/article/service
 * @author Surmon <https://github.com/surmon-china>
 */

import lodash from 'lodash'
import { Types, FilterQuery, SortOrder } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@app/transformers/model.transformer'
import { getArticleUrl } from '@app/transformers/urlmap.transformer'
import { SeoService } from '@app/processors/helper/helper.service.seo'
import { CacheService } from '@app/processors/cache/cache.service'
import { increaseTodayViewsCount } from '@app/modules/expansion/expansion.helper'
import { ArchiveService } from '@app/modules/archive/archive.service'
import { TagService } from '@app/modules/tag/tag.service'
import { PublishState } from '@app/constants/biz.constant'
import { NULL } from '@app/constants/value.constant'
import { MongooseModel, MongooseDoc, MongooseID } from '@app/interfaces/mongoose.interface'
import { PaginateResult, PaginateQuery, PaginateOptions } from '@app/utils/paginate'
import {
  Article,
  ARTICLE_LIST_QUERY_GUEST_FILTER,
  ARTICLE_LIST_QUERY_PROJECTION,
  ARTICLE_FULL_QUERY_REF_POPULATE,
  ARTICLE_HOTTEST_SORT_PARAMS
} from './article.model'
import * as CACHE_KEY from '@app/constants/cache.constant'

@Injectable()
export class ArticleService {
  private hottestArticlesCache: () => Promise<Array<Article>>

  constructor(
    private readonly seoService: SeoService,
    private readonly tagService: TagService,
    private readonly cacheService: CacheService,
    private readonly archiveService: ArchiveService,
    @InjectModel(Article) private readonly articleModel: MongooseModel<Article>
  ) {
    this.hottestArticlesCache = this.cacheService.interval({
      key: CACHE_KEY.HOTTEST_ARTICLES,
      promise: () => this.getHottestArticles(20),
      interval: 1000 * 60 * 30, // 30 mins,
      retry: 1000 * 60 * 5 // 5 mins
    })
  }

  public getHottestArticles(count: number): Promise<Array<Article>> {
    return this.paginator(ARTICLE_LIST_QUERY_GUEST_FILTER, {
      perPage: count,
      sort: ARTICLE_HOTTEST_SORT_PARAMS
    }).then((result) => result.documents)
  }

  public getHottestArticlesCache(): Promise<Array<Article>> {
    return this.hottestArticlesCache()
  }

  // get near articles
  public async getNearArticles(articleID: number, type: 'later' | 'early', count: number): Promise<Article[]> {
    const typeFieldMap = {
      early: { field: '$lt', sort: -1 as SortOrder },
      later: { field: '$gt', sort: 1 as SortOrder }
    }
    const targetType = typeFieldMap[type]
    return this.articleModel
      .find(
        { ...ARTICLE_LIST_QUERY_GUEST_FILTER, id: { [targetType.field]: articleID } },
        ARTICLE_LIST_QUERY_PROJECTION
      )
      .populate(ARTICLE_FULL_QUERY_REF_POPULATE)
      .sort({ id: targetType.sort })
      .limit(count)
      .exec()
  }

  // get related articles
  public async getRelatedArticles(article: Article, count: number): Promise<Article[]> {
    const findParams: FilterQuery<Article> = {
      ...ARTICLE_LIST_QUERY_GUEST_FILTER,
      tags: { $in: article.tags },
      categories: { $in: article.categories }
    }
    const articles = await this.articleModel
      .find(findParams, ARTICLE_LIST_QUERY_PROJECTION, { limit: count * 2 })
      .populate(ARTICLE_FULL_QUERY_REF_POPULATE)
      .exec()
    const filtered = articles.filter((a) => a.id !== article.id).map((a) => a.toObject())
    return lodash.sampleSize<Article>(filtered, count)
  }

  // get paginate articles
  public paginator(query: PaginateQuery<Article>, options: PaginateOptions): Promise<PaginateResult<Article>> {
    return this.articleModel.paginate(query, {
      ...options,
      projection: ARTICLE_LIST_QUERY_PROJECTION,
      populate: ARTICLE_FULL_QUERY_REF_POPULATE
    })
  }

  // get articles by ids
  public getList(articleIDs: number[]): Promise<Array<Article>> {
    return this.articleModel.find({ id: { $in: articleIDs } }).exec()
  }

  // get article by ObjectID
  public getDetailByObjectID(articleID: MongooseID): Promise<MongooseDoc<Article>> {
    return this.articleModel
      .findById(articleID)
      .exec()
      .then((result) => result || Promise.reject(`Article '${articleID}' not found`))
  }

  // get article by number id
  public getDetailByNumberIDOrSlug({
    idOrSlug,
    publicOnly = false,
    populate = false
  }: {
    idOrSlug: number | string
    publicOnly?: boolean
    populate?: boolean
  }): Promise<MongooseDoc<Article>> {
    const params: FilterQuery<Article> = {}
    if (typeof idOrSlug === 'string') {
      params.slug = idOrSlug
    } else {
      params.id = idOrSlug
    }

    return this.articleModel
      .findOne(publicOnly ? { ...params, ...ARTICLE_LIST_QUERY_GUEST_FILTER } : params)
      .populate(populate ? ARTICLE_FULL_QUERY_REF_POPULATE : [])
      .exec()
      .then((result) => result || Promise.reject(`Article '${idOrSlug}' not found`))
  }

  // get article detail for guest user
  public async getFullDetailForGuest(target: number | string): Promise<Article> {
    const article = await this.getDetailByNumberIDOrSlug({
      idOrSlug: target,
      publicOnly: true,
      populate: true
    })

    // article views
    article.meta.views++
    article.save({ timestamps: false })

    // global today views
    increaseTodayViewsCount(this.cacheService)

    return article.toObject()
  }

  public async incrementLikes(articleID: number) {
    const article = await this.getDetailByNumberIDOrSlug({
      idOrSlug: articleID,
      publicOnly: true
    })
    article.meta.likes++
    await article.save({ timestamps: false })
    return article.meta.likes
  }

  public async create(newArticle: Article): Promise<MongooseDoc<Article>> {
    if (newArticle.slug) {
      const existedArticle = await this.articleModel.findOne({ slug: newArticle.slug }).exec()
      if (existedArticle) {
        throw `Article slug '${newArticle.slug}' is existed`
      }
    }

    const article = await this.articleModel.create(newArticle)
    this.seoService.push(getArticleUrl(article.id))
    this.tagService.updateAllTagsCache()
    this.archiveService.updateCache()
    return article
  }

  public async update(articleID: MongooseID, newArticle: Article): Promise<MongooseDoc<Article>> {
    if (newArticle.slug) {
      const existedArticle = await this.articleModel.findOne({ slug: newArticle.slug }).exec()
      if (existedArticle && !existedArticle._id.equals(articleID)) {
        throw `Article slug '${newArticle.slug}' is existed`
      }
    }

    Reflect.deleteProperty(newArticle, 'meta')
    Reflect.deleteProperty(newArticle, 'created_at')
    Reflect.deleteProperty(newArticle, 'updated_at')

    const article = await this.articleModel.findByIdAndUpdate(articleID, newArticle, { new: true }).exec()
    if (!article) {
      throw `Article '${articleID}' not found`
    }
    this.seoService.update(getArticleUrl(article.id))
    this.tagService.updateAllTagsCache()
    this.archiveService.updateCache()
    return article
  }

  public async delete(articleID: MongooseID): Promise<MongooseDoc<Article>> {
    const article = await this.articleModel.findByIdAndRemove(articleID).exec()
    if (!article) {
      throw `Article '${articleID}' not found`
    }
    this.seoService.delete(getArticleUrl(article.id))
    this.tagService.updateAllTagsCache()
    this.archiveService.updateCache()
    return article
  }

  public async batchPatchState(articleIDs: MongooseID[], state: PublishState) {
    const actionResult = await this.articleModel
      .updateMany({ _id: { $in: articleIDs } }, { $set: { state } }, { multi: true })
      .exec()
    this.tagService.updateAllTagsCache()
    this.archiveService.updateCache()
    return actionResult
  }

  public async batchDelete(articleIDs: MongooseID[]) {
    const articles = await this.articleModel.find({ _id: { $in: articleIDs } }).exec()
    this.seoService.delete(articles.map((article) => getArticleUrl(article.id)))

    const actionResult = await this.articleModel.deleteMany({ _id: { $in: articleIDs } }).exec()
    this.tagService.updateAllTagsCache()
    this.archiveService.updateCache()
    return actionResult
  }

  public async getTotalCount(publicOnly: boolean): Promise<number> {
    return await this.articleModel.countDocuments(publicOnly ? ARTICLE_LIST_QUERY_GUEST_FILTER : {}).exec()
  }

  public getCalendar(publicOnly: boolean, timezone = 'GMT') {
    return this.articleModel
      .aggregate<{ _id: string; count: number }>([
        { $match: publicOnly ? ARTICLE_LIST_QUERY_GUEST_FILTER : {} },
        { $project: { day: { $dateToString: { date: '$created_at', format: '%Y-%m-%d', timezone } } } },
        { $group: { _id: '$day', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ])
      .then((calendar) => calendar.map(({ _id, ...r }) => ({ ...r, date: _id })))
      .catch(() => Promise.reject(`Invalid timezone identifier: '${timezone}'`))
  }

  public async getMetaStatistic() {
    const [result] = await this.articleModel.aggregate<{
      _id: Types.ObjectId
      totalViews: number
      totalLikes: number
    }>([
      {
        $group: {
          _id: null,
          totalViews: { $sum: '$meta.views' },
          totalLikes: { $sum: '$meta.likes' }
        }
      }
    ])

    if (!result) {
      return NULL
    } else {
      return {
        totalViews: result.totalViews,
        totalLikes: result.totalLikes
      }
    }
  }

  // article commentable state
  public async isCommentableArticle(articleID: number): Promise<boolean> {
    const article = await this.articleModel.findOne({ id: articleID }).exec()
    return Boolean(article && !article.disabled_comments)
  }

  // update article comments count
  public async updateMetaComments(articleID: number, commentCount: number) {
    const findParams = { id: articleID }
    const patchParams = { $set: { 'meta.comments': commentCount } }
    return this.articleModel.updateOne(findParams, patchParams, { timestamps: false }).exec()
  }
}
