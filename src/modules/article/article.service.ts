/**
 * @file Article service
 * @module module/article/service
 * @author Surmon <https://github.com/surmon-china>
 */

import lodash from 'lodash'
import { Types, FilterQuery } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@app/transformers/model.transformer'
import { getArticleUrl } from '@app/transformers/urlmap.transformer'
import { SeoService } from '@app/processors/helper/helper.service.seo'
import { CacheService, CacheIntervalResult } from '@app/processors/cache/cache.service'
import { ArchiveService } from '@app/modules/archive/archive.service'
import { TagService } from '@app/modules/tag/tag.service'
import { PublishState } from '@app/interfaces/biz.interface'
import { MongooseModel, MongooseDoc, MongooseID } from '@app/interfaces/mongoose.interface'
import { PaginateResult, PaginateQuery, PaginateOptions } from '@app/utils/paginate'
import { Article, ARTICLE_GUEST_QUERY_FILTER, ARTICLE_HOT_SORT_PARAMS } from './article.model'
import * as CACHE_KEY from '@app/constants/cache.constant'

@Injectable()
export class ArticleService {
  private hotArticlesCache: CacheIntervalResult<Array<Article>>

  constructor(
    private readonly seoService: SeoService,
    private readonly tagService: TagService,
    private readonly cacheService: CacheService,
    private readonly archiveService: ArchiveService,
    @InjectModel(Article) private readonly articleModel: MongooseModel<Article>
  ) {
    this.hotArticlesCache = this.cacheService.interval({
      key: CACHE_KEY.HOT_ARTICLES,
      promise: () => this.getHotArticles(20),
      timeout: {
        success: 1000 * 60 * 30, // 成功后 30 分钟更新一次数据
        error: 1000 * 60 * 5, // 失败后 5 分钟更新一次数据
      },
    })
  }

  public getHotArticles(count: number): Promise<Array<Article>> {
    return this.paginater(ARTICLE_GUEST_QUERY_FILTER, {
      perPage: count,
      sort: ARTICLE_HOT_SORT_PARAMS,
    }).then((result) => result.documents)
  }

  public getHotArticlesCache(): Promise<Array<Article>> {
    return this.hotArticlesCache()
  }

  // get related articles
  public async getRelatedArticles(article: Article, count: number): Promise<Article[]> {
    const findParams: FilterQuery<Article> = {
      ...ARTICLE_GUEST_QUERY_FILTER,
      tag: { $in: article.tag.map((t) => (t as any)._id) },
      category: { $in: article.category.map((c) => (c as any)._id) },
    }
    const articles = await this.articleModel.find(findParams, '-content', { limit: count * 3 }).exec()
    const filtered = articles.filter((a) => a.id !== article.id).map((a) => a.toObject())
    return lodash.sampleSize(filtered, count)
  }

  // get paginate articles
  public paginater(query: PaginateQuery<Article>, options: PaginateOptions): Promise<PaginateResult<Article>> {
    return this.articleModel.paginate(query, {
      ...options,
      projection: '-content',
      populate: ['category', 'tag'],
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
    populate = false,
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
      .findOne(publicOnly ? { ...params, ...ARTICLE_GUEST_QUERY_FILTER } : params)
      .populate(populate ? ['category', 'tag'] : [])
      .exec()
      .then((result) => result || Promise.reject(`Article '${idOrSlug}' not found`))
  }

  // get article detail for guest user
  public async getFullDetailForGuest(target: number | string): Promise<Article> {
    const article = await this.getDetailByNumberIDOrSlug({
      idOrSlug: target,
      publicOnly: true,
      populate: true,
    })

    // article views
    article.meta.views++
    article.save()

    // global today views
    this.cacheService.get<number>(CACHE_KEY.TODAY_VIEWS).then((views) => {
      this.cacheService.set(CACHE_KEY.TODAY_VIEWS, (views || 0) + 1)
    })

    return article.toObject()
  }

  public async incrementLikes(articleID: number) {
    const article = await this.getDetailByNumberIDOrSlug({
      idOrSlug: articleID,
      publicOnly: true,
    })
    article.meta.likes++
    await article.save()
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
      if (existedArticle && String(existedArticle._id) !== String(articleID)) {
        throw `Article slug '${newArticle.slug}' is existed`
      }
    }

    Reflect.deleteProperty(newArticle, 'meta')
    Reflect.deleteProperty(newArticle, 'create_at')
    Reflect.deleteProperty(newArticle, 'update_at')

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
    return await this.articleModel.countDocuments(publicOnly ? ARTICLE_GUEST_QUERY_FILTER : {}).exec()
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
          totalLikes: { $sum: '$meta.likes' },
        },
      },
    ])

    return {
      totalViews: result.totalViews,
      totalLikes: result.totalLikes,
    }
  }

  // article commentable state
  public async isCommentableArticle(articleID: number): Promise<boolean> {
    const article = await this.articleModel.findOne({ id: articleID }).exec()
    return Boolean(article && !article.disabled_comment)
  }

  // update article comments count
  public async updateMetaComments(articleID: number, commentCount: number) {
    const findParams = { id: articleID }
    const patchParams = { $set: { 'meta.comments': commentCount } }
    return this.articleModel.updateOne(findParams, patchParams).exec()
  }
}
