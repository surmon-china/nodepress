/**
 * @file Article service
 * @module module/article/service
 * @author Surmon <https://github.com/surmon-china>
 */

import type { QueryFilter } from 'mongoose'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { Injectable, OnModuleInit, NotFoundException, ConflictException } from '@nestjs/common'
import { MongooseModel } from '@app/interfaces/mongoose.interface'
import { InjectModel } from '@app/transformers/model.transformer'
import { SortOrder } from '@app/constants/sort.constant'
import { CacheKeys } from '@app/constants/cache.constant'
import { EventKeys } from '@app/constants/events.constant'
import { SeoService } from '@app/core/helper/helper.service.seo'
import { CacheService, CacheManualResult } from '@app/core/cache/cache.service'
import { PaginateOptions, PaginateResult } from '@app/utils/paginate'
import { getArticleUrl } from '@app/transformers/urlmap.transformer'
import { ArticleStatus, ARTICLE_PUBLIC_FILTER } from './article.constant'
import { Article, ArticleDoc, ArticleDocPopulated } from './article.model'
import { ArticlePopulated, ArticleListItemPopulated } from './article.model'
import { ARTICLE_RELATION_FIELDS, ARTICLE_LIST_QUERY_PROJECTION } from './article.model'
import { CreateArticleDto, UpdateArticleDto } from './article.dto'
import { createLogger } from '@app/utils/logger'
import { isDevEnv } from '@app/app.environment'

const logger = createLogger({ scope: 'ArticleService', time: isDevEnv })

@Injectable()
export class ArticleService implements OnModuleInit {
  private allPublicArticlesCache: CacheManualResult<Array<ArticleListItemPopulated>>

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly seoService: SeoService,
    private readonly cacheService: CacheService,
    @InjectModel(Article) private readonly articleModel: MongooseModel<Article>
  ) {
    this.allPublicArticlesCache = this.cacheService.manual<Array<ArticleListItemPopulated>>({
      key: CacheKeys.PublicAllArticles,
      promise: () => this.getAllArticles({ publicOnly: true, withDetail: false })
    })
  }

  onModuleInit() {
    this.allPublicArticlesCache.update().catch((error) => {
      logger.warn('Init getAllArticles failed!', error)
    })
  }

  public getAllPublicArticlesCache(): Promise<Array<ArticleListItemPopulated>> {
    return this.allPublicArticlesCache.get()
  }

  public updateAllPublicArticlesCache(): Promise<Array<ArticleListItemPopulated>> {
    return this.allPublicArticlesCache.update()
  }

  // Get paginate articles
  public paginate(
    filter: QueryFilter<Article>,
    options: PaginateOptions
  ): Promise<PaginateResult<ArticleListItemPopulated>> {
    return this.articleModel.paginateRaw(filter, {
      ...options,
      populate: ARTICLE_RELATION_FIELDS,
      projection: ARTICLE_LIST_QUERY_PROJECTION
    })
  }

  // Get all articles
  public getAllArticles(options: { publicOnly: boolean; withDetail: boolean }) {
    const query = this.articleModel
      .find(options.publicOnly ? ARTICLE_PUBLIC_FILTER : {})
      .sort({ created_at: SortOrder.Desc })
      .populate<ArticlePopulated>(ARTICLE_RELATION_FIELDS)
      .lean()

    return !options.withDetail
      ? query.select<ArticleListItemPopulated>(ARTICLE_LIST_QUERY_PROJECTION).exec()
      : query.exec()
  }

  // Get article by number id or slug
  public async getDetail<TLean extends boolean = false, TPopulate extends boolean = false>(
    idOrSlug: number | string,
    options: {
      lean?: TLean
      populate?: TPopulate
      publicOnly?: boolean
    } = {}
  ): Promise<
    TLean extends true
      ? TPopulate extends true
        ? ArticlePopulated
        : Article
      : TPopulate extends true
        ? ArticleDocPopulated
        : ArticleDoc
  > {
    const { publicOnly = false, populate = false, lean = false } = options

    const queryFilter: QueryFilter<Article> = {}
    if (typeof idOrSlug === 'number') queryFilter.id = idOrSlug
    if (typeof idOrSlug === 'string') queryFilter.slug = idOrSlug

    const articleQuery = this.articleModel
      .findOne(publicOnly ? { ...queryFilter, ...ARTICLE_PUBLIC_FILTER } : queryFilter)
      .populate(populate ? ARTICLE_RELATION_FIELDS : [])

    const article = lean ? await articleQuery.lean<Article>().exec() : await articleQuery.exec()
    if (!article) throw new NotFoundException(`Article '${idOrSlug}' not found`)

    return article as any
  }

  public async create(input: CreateArticleDto): Promise<ArticleDoc> {
    if (input.slug) {
      const existed = await this.articleModel.findOne({ slug: input.slug }).lean().exec()
      if (existed) throw new ConflictException(`Article slug '${input.slug}' already exists`)
    }

    const created = await this.articleModel.create(input)
    this.updateAllPublicArticlesCache()
    this.eventEmitter.emit(EventKeys.ArticleCreated, created)
    this.seoService.push(getArticleUrl(created.id))
    return created
  }

  public async update(articleId: number, input: UpdateArticleDto): Promise<ArticleDoc> {
    if (input.slug) {
      const existed = await this.articleModel.findOne({ slug: input.slug }).lean().exec()
      if (existed && existed.id !== articleId) {
        throw new ConflictException(`Article slug '${input.slug}' already exists`)
      }
    }

    Reflect.deleteProperty(input, 'id')
    Reflect.deleteProperty(input, 'stats')
    Reflect.deleteProperty(input, 'created_at')
    Reflect.deleteProperty(input, 'updated_at')

    const updated = await this.articleModel
      .findOneAndUpdate({ id: articleId }, { $set: input }, { returnDocument: 'after' })
      .exec()
    if (!updated) throw new NotFoundException(`Article '${articleId}' not found`)

    this.updateAllPublicArticlesCache()
    this.eventEmitter.emit(EventKeys.ArticleUpdated, updated)
    this.seoService.update(getArticleUrl(updated.id))
    return updated
  }

  public async delete(articleId: number) {
    const deleted = await this.articleModel.findOneAndDelete({ id: articleId }).exec()
    if (!deleted) throw new NotFoundException(`Article '${articleId}' not found`)

    this.updateAllPublicArticlesCache()
    this.eventEmitter.emit(EventKeys.ArticleDeleted, deleted)
    this.seoService.delete(getArticleUrl(deleted.id))
    return deleted
  }

  public async batchUpdateStatus(articleIds: number[], status: ArticleStatus) {
    const actionResult = await this.articleModel
      .updateMany({ id: { $in: articleIds } }, { $set: { status } })
      .exec()
    this.updateAllPublicArticlesCache()
    this.eventEmitter.emit(EventKeys.ArticlesStatusChanged, { articleIds, status })
    return actionResult
  }

  public async batchDelete(articleIds: number[]) {
    const articles = await this.articleModel
      .find({ id: { $in: articleIds } })
      .lean()
      .exec()

    const actionResult = await this.articleModel.deleteMany({ id: { $in: articleIds } }).exec()
    this.updateAllPublicArticlesCache()
    this.eventEmitter.emit(EventKeys.ArticlesDeleted, articleIds)
    this.seoService.delete(articles.map((article) => getArticleUrl(article.id)))
    return actionResult
  }

  // Article commentable state
  public async isCommentableArticle(articleId: number): Promise<boolean> {
    const article = await this.articleModel.findOne({ id: articleId }).select('disabled_comments').lean().exec()
    return Boolean(article && !article.disabled_comments)
  }
}
