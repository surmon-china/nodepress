/**
 * @file Article service
 * @module module/article/service
 * @author Surmon <https://github.com/surmon-china>
 */

import { Types, FilterQuery, SortOrder } from 'mongoose'
import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common'
import { InjectModel } from '@app/transformers/model.transformer'
import { SeoService } from '@app/core/helper/helper.service.seo'
import { CacheService } from '@app/core/cache/cache.service'
import { increaseTodayViewsCount } from '@app/modules/extension/extension.helper'
import { ArchiveService } from '@app/modules/archive/archive.service'
import { CategoryService } from '@app/modules/category/category.service'
import { TagService } from '@app/modules/tag/tag.service'
import { PublishState } from '@app/constants/biz.constant'
import { MongooseModel, MongooseDoc, MongooseId } from '@app/interfaces/mongoose.interface'
import { PaginateResult, PaginateQuery, PaginateOptions } from '@app/utils/paginate'
import { getArticleUrl } from '@app/transformers/urlmap.transformer'
import {
  Article,
  ARTICLE_LIST_QUERY_GUEST_FILTER,
  ARTICLE_LIST_QUERY_PROJECTION,
  ARTICLE_FULL_QUERY_REF_POPULATE
} from './article.model'

@Injectable()
export class ArticleService {
  constructor(
    private readonly seoService: SeoService,
    private readonly cacheService: CacheService,
    private readonly tagService: TagService,
    private readonly categoryService: CategoryService,
    private readonly archiveService: ArchiveService,
    @InjectModel(Article) private readonly articleModel: MongooseModel<Article>
  ) {}

  // Get near articles
  public async getNearArticles(articleId: number, type: 'later' | 'early', count: number): Promise<Article[]> {
    const typeFieldMap = {
      early: { field: '$lt', sort: -1 as SortOrder },
      later: { field: '$gt', sort: 1 as SortOrder }
    }
    const targetType = typeFieldMap[type]
    return this.articleModel
      .find(
        { ...ARTICLE_LIST_QUERY_GUEST_FILTER, id: { [targetType.field]: articleId } },
        ARTICLE_LIST_QUERY_PROJECTION
      )
      .populate(ARTICLE_FULL_QUERY_REF_POPULATE)
      .sort({ id: targetType.sort })
      .limit(count)
      .exec()
  }

  // Get related articles
  public getRelatedArticles(article: Article, count: number): Promise<Article[]> {
    const findParams: FilterQuery<Article> = {
      ...ARTICLE_LIST_QUERY_GUEST_FILTER,
      tags: { $in: article.tags },
      categories: { $in: article.categories },
      // Exclude the current article in the query
      id: { $ne: article.id }
    }

    return this.articleModel.aggregate<Article>([
      { $match: findParams },
      // Randomly select articles at the database level
      { $sample: { size: count } },
      // Select the required fields (-content)
      { $project: ARTICLE_LIST_QUERY_PROJECTION },
      // Populate reference fields
      ...ARTICLE_FULL_QUERY_REF_POPULATE.map((field) => ({
        $lookup: {
          from: field, //  Name of the collection to join (e.g., categories)
          localField: field, // Field from the input documents (e.g., categories)
          foreignField: '_id', // Field from the documents of the "from" collection
          as: field // Output array field (e.g., categories)
        }
      }))
    ])
  }

  // get paginate articles
  public paginate(query: PaginateQuery<Article>, options: PaginateOptions): Promise<PaginateResult<Article>> {
    return this.articleModel.paginate(query, {
      ...options,
      projection: ARTICLE_LIST_QUERY_PROJECTION,
      populate: ARTICLE_FULL_QUERY_REF_POPULATE
    })
  }

  // Get articles by ids
  public getList(articleIds: number[]): Promise<Article[]> {
    return this.articleModel.find({ id: { $in: articleIds } }).exec()
  }

  // Get article by ObjectID
  public async getDetailByObjectId(articleId: MongooseId): Promise<MongooseDoc<Article>> {
    const article = await this.articleModel.findById(articleId).exec()
    if (!article) throw new NotFoundException(`Article '${articleId}' not found`)
    return article
  }

  // Get article by number id or slug
  public async getDetailByNumberIdOrSlug({
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

    const article = await this.articleModel
      .findOne(publicOnly ? { ...params, ...ARTICLE_LIST_QUERY_GUEST_FILTER } : params)
      .populate(populate ? ARTICLE_FULL_QUERY_REF_POPULATE : [])
      .exec()

    if (!article) {
      throw new NotFoundException(`Article '${idOrSlug}' not found`)
    }

    return article
  }

  // Get article detail for guest user
  public async getFullDetailForGuest(target: number | string): Promise<Article> {
    const article = await this.getDetailByNumberIdOrSlug({
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

  public async incrementLikes(articleId: number) {
    const article = await this.getDetailByNumberIdOrSlug({
      idOrSlug: articleId,
      publicOnly: true
    })
    article.meta.likes++
    await article.save({ timestamps: false })
    return article.meta.likes
  }

  public async create(newArticle: Article): Promise<MongooseDoc<Article>> {
    if (newArticle.slug) {
      const existedArticle = await this.articleModel.findOne({ slug: newArticle.slug }).exec()
      if (existedArticle) throw new ConflictException(`Article slug '${newArticle.slug}' already exists`)
    }

    const article = await this.articleModel.create(newArticle)
    this.seoService.push(getArticleUrl(article.id))
    this.tagService.updateAllTagsCache()
    this.categoryService.updateAllCategoriesCache()
    this.archiveService.updateCache()
    return article
  }

  public async update(articleId: MongooseId, newArticle: Article): Promise<MongooseDoc<Article>> {
    if (newArticle.slug) {
      const existedArticle = await this.articleModel.findOne({ slug: newArticle.slug }).exec()
      if (existedArticle && !existedArticle._id.equals(articleId)) {
        throw new ConflictException(`Article slug '${newArticle.slug}' already exists`)
      }
    }

    Reflect.deleteProperty(newArticle, 'meta')
    Reflect.deleteProperty(newArticle, 'created_at')
    Reflect.deleteProperty(newArticle, 'updated_at')

    const article = await this.articleModel.findByIdAndUpdate(articleId, newArticle, { new: true }).exec()
    if (!article) throw new NotFoundException(`Article '${articleId}' not found`)

    this.seoService.update(getArticleUrl(article.id))
    this.tagService.updateAllTagsCache()
    this.categoryService.updateAllCategoriesCache()
    this.archiveService.updateCache()
    return article
  }

  public async delete(articleId: MongooseId) {
    const article = await this.articleModel.findByIdAndDelete(articleId, null).exec()
    if (!article) throw new NotFoundException(`Article '${articleId}' not found`)

    this.seoService.delete(getArticleUrl(article.id))
    this.tagService.updateAllTagsCache()
    this.categoryService.updateAllCategoriesCache()
    this.archiveService.updateCache()
    return article
  }

  public async batchPatchState(articleIds: MongooseId[], state: PublishState) {
    const actionResult = await this.articleModel
      .updateMany({ _id: { $in: articleIds } }, { $set: { state } }, { multi: true })
      .exec()
    this.tagService.updateAllTagsCache()
    this.categoryService.updateAllCategoriesCache()
    this.archiveService.updateCache()
    return actionResult
  }

  public async batchDelete(articleIds: MongooseId[]) {
    const articles = await this.articleModel.find({ _id: { $in: articleIds } }).exec()
    this.seoService.delete(articles.map((article) => getArticleUrl(article.id)))

    const actionResult = await this.articleModel.deleteMany({ _id: { $in: articleIds } }).exec()
    this.tagService.updateAllTagsCache()
    this.categoryService.updateAllCategoriesCache()
    this.archiveService.updateCache()
    return actionResult
  }

  public async getTotalCount(publicOnly: boolean): Promise<number> {
    return await this.articleModel.countDocuments(publicOnly ? ARTICLE_LIST_QUERY_GUEST_FILTER : {}).exec()
  }

  public async getCalendar(publicOnly: boolean, timezone = 'GMT') {
    try {
      const calendar = await this.articleModel.aggregate<{ _id: string; count: number }>([
        { $match: publicOnly ? ARTICLE_LIST_QUERY_GUEST_FILTER : {} },
        { $project: { day: { $dateToString: { date: '$created_at', format: '%Y-%m-%d', timezone } } } },
        { $group: { _id: '$day', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ])
      return calendar.map(({ _id, ...rest }) => ({ ...rest, date: _id }))
    } catch (error) {
      throw new BadRequestException(`Invalid timezone identifier: '${timezone}'`)
    }
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
      return null
    }

    return {
      totalViews: result.totalViews,
      totalLikes: result.totalLikes
    }
  }

  // Article commentable state
  public async isCommentableArticle(articleId: number): Promise<boolean> {
    const article = await this.articleModel.findOne({ id: articleId }).exec()
    return Boolean(article && !article.disabled_comments)
  }

  // Update article comments count
  public async updateMetaComments(articleId: number, commentCount: number) {
    const findParams = { id: articleId }
    const patchParams = { $set: { 'meta.comments': commentCount } }
    return this.articleModel.updateOne(findParams, patchParams, { timestamps: false }).exec()
  }
}
