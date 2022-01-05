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

export const COMMON_HOT_SORT_PARAMS = {
  'meta.comments': SortType.Desc,
  'meta.likes': SortType.Desc,
}

export const COMMON_USER_QUERY_PARAMS = Object.freeze({
  state: PublishState.Published,
  public: PublicState.Public,
})

@Injectable()
export class ArticleService {
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
        return this.paginater.bind(this)(COMMON_USER_QUERY_PARAMS, {
          perPage: 10,
          sort: COMMON_HOT_SORT_PARAMS,
        })
      },
    })
  }

  public getUserHotListCache(): Promise<PaginateResult<Article>> {
    return this.hotArticleListCache()
  }

  // get releted articles
  private async getRandomRelatedArticles(article: Article, count = 12): Promise<Article[]> {
    const findParams = {
      ...COMMON_USER_QUERY_PARAMS,
      tag: { $in: article.tag.map((t) => (t as any)._id) },
      category: { $in: article.category.map((c) => (c as any)._id) },
    }
    const projection = 'id title description thumb meta create_at update_at -_id'
    const articles = await this.articleModel.find(findParams, projection).exec()
    const filtered = articles.filter((a) => a.id !== article.id)
    return lodash.sampleSize(filtered, count)
  }

  // get paginate articles
  public paginater(querys, options: PaginateOptions): Promise<PaginateResult<Article>> {
    return this.articleModel.paginate(querys, {
      ...options,
      populate: ['category', 'tag'],
      select: '-password -content',
    })
  }

  // get articles by ids
  public getList(articleIDs: number[]): Promise<Array<Article>> {
    return this.articleModel.find({ id: { $in: articleIDs } }).exec()
  }

  // get article by ObjectId
  public getDetailByObjectID(articleID: Types.ObjectId): Promise<Article> {
    return this.articleModel
      .findById(articleID)
      .exec()
      .then((result) => result || Promise.reject(`Article "${articleID}" not found`))
  }

  // get article by number id (for client)
  public getDetailByNumberIDOrSlug(target: number | string): Promise<DocumentType<Article>> {
    const params: any = { ...COMMON_USER_QUERY_PARAMS }
    if (typeof target === 'string') {
      params.slug = target
    } else {
      params.id = target
    }

    return this.articleModel
      .findOne(params)
      .select('-password')
      .populate(['category', 'tag'])
      .exec()
      .then((result) => result || Promise.reject(`Article "${target}" not found`))
  }

  // get article detail for user
  public async getFullDetailForUser(target: number | string): Promise<Article> {
    const article = await this.getDetailByNumberIDOrSlug(target)

    // article views
    article.meta.views++
    article.save()

    // global today views
    this.cacheService.get<number>(CACHE_KEY.TODAY_VIEWS).then((views) => {
      this.cacheService.set(CACHE_KEY.TODAY_VIEWS, (views || 0) + 1)
    })

    // releted articles
    const articleObject = article.toObject()
    return {
      ...articleObject,
      related: await this.getRandomRelatedArticles(articleObject),
    }
  }

  public async like(articleID: number) {
    const article = await this.getDetailByNumberIDOrSlug(articleID)
    article.meta.likes++
    await article.save()
    return article.meta.likes
  }

  public async create(newArticle: Article): Promise<Article> {
    if (newArticle.slug) {
      const existedArticle = await this.articleModel.findOne({ slug: newArticle.slug }).exec()
      if (existedArticle) {
        throw `Article slug "${newArticle.slug}" is existed`
      }
    }

    const article = await this.articleModel.create({
      ...newArticle,
      meta: getDefaultMeta(),
    })
    this.seoService.push(getArticleUrl(article.id))
    this.tagService.updatePaginateCache()
    this.archiveService.updateCache()
    return article
  }

  public async update(articleID: Types.ObjectId, newArticle: Article): Promise<Article> {
    if (newArticle.slug) {
      const existedArticle = await this.articleModel.findOne({ slug: newArticle.slug }).exec()
      if (existedArticle && String(existedArticle._id) !== String(articleID)) {
        throw `Article slug "${newArticle.slug}" is existed`
      }
    }

    Reflect.deleteProperty(newArticle, 'meta')
    Reflect.deleteProperty(newArticle, 'create_at')
    Reflect.deleteProperty(newArticle, 'update_at')

    const article = await this.articleModel.findByIdAndUpdate(articleID, newArticle, { new: true }).exec()
    if (!article) {
      throw `Article "${articleID}" not found`
    }
    this.seoService.update(getArticleUrl(article.id))
    this.tagService.updatePaginateCache()
    this.archiveService.updateCache()
    return article
  }

  public async delete(articleID: Types.ObjectId): Promise<Article> {
    const article = await this.articleModel.findByIdAndRemove(articleID).exec()
    if (!article) {
      throw `Article "${articleID}" not found`
    }
    this.seoService.delete(getArticleUrl(article.id))
    this.tagService.updatePaginateCache()
    this.archiveService.updateCache()
    return article
  }

  public async batchPatchState(articleIDs: Types.ObjectId[], state: PublishState) {
    const actionResult = await this.articleModel
      .updateMany({ _id: { $in: articleIDs } }, { $set: { state } }, { multi: true })
      .exec()
    this.tagService.updatePaginateCache()
    this.archiveService.updateCache()
    return actionResult
  }

  public async batchDelete(articleIDs: Types.ObjectId[]) {
    const articles = await this.articleModel.find({ _id: { $in: articleIDs } }).exec()
    this.seoService.delete(articles.map((article) => getArticleUrl(article.id)))

    const actionResult = await this.articleModel.deleteMany({
      _id: { $in: articleIDs },
    })
    this.tagService.updatePaginateCache()
    this.archiveService.updateCache()
    return actionResult
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
