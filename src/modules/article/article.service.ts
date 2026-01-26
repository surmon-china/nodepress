/**
 * @file Article service
 * @module module/article/service
 * @author Surmon <https://github.com/surmon-china>
 */

import { Types } from 'mongoose'
import type { QueryFilter, SortOrder } from 'mongoose'
import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common'
import { InjectModel } from '@app/transformers/model.transformer'
import { SeoService } from '@app/core/helper/helper.service.seo'
import { ArchiveService } from '@app/modules/archive/archive.service'
import { CategoryService } from '@app/modules/category/category.service'
import { TagService } from '@app/modules/tag/tag.service'
import { MongooseModel, MongooseDoc, MongooseId } from '@app/interfaces/mongoose.interface'
import { PaginateOptions, PaginateResult } from '@app/utils/paginate'
import { getArticleUrl } from '@app/transformers/urlmap.transformer'
import { Article, ArticleStats } from './article.model'
import {
  ArticleStatus,
  ARTICLE_LIST_QUERY_GUEST_FILTER,
  ARTICLE_LIST_QUERY_PROJECTION,
  ARTICLE_FULL_QUERY_REF_POPULATE
} from './article.constant'

@Injectable()
export class ArticleService {
  constructor(
    private readonly seoService: SeoService,
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
      .lean()
      .exec()
  }

  // Get related articles
  public getRelatedArticles(article: Article, count: number): Promise<Article[]> {
    const queryFilter: QueryFilter<Article> = {
      ...ARTICLE_LIST_QUERY_GUEST_FILTER,
      tags: { $in: article.tags },
      categories: { $in: article.categories },
      // Exclude the current article in the query
      id: { $ne: article.id }
    }

    return this.articleModel.aggregate<Article>([
      { $match: queryFilter },
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

  // Get paginate articles
  public paginate(filter: QueryFilter<Article>, options: PaginateOptions): Promise<PaginateResult<Article>> {
    return this.articleModel.paginateRaw(filter, {
      ...options,
      projection: ARTICLE_LIST_QUERY_PROJECTION,
      populate: ARTICLE_FULL_QUERY_REF_POPULATE
    })
  }

  // Get all articles
  // MARK: Providing this capability only for admin. (Consumes a lot of computing resources.)
  public getAll(): Promise<Array<Article>> {
    return this.articleModel.find({}, null, {
      sort: { _id: -1 },
      populate: ARTICLE_FULL_QUERY_REF_POPULATE
    })
  }

  // Get articles by ids
  public getList(articleIds: number[]): Promise<Article[]> {
    return this.articleModel
      .find({ id: { $in: articleIds } })
      .lean()
      .exec()
  }

  // Get article by ObjectId
  public async getDetailByObjectId(articleId: MongooseId): Promise<Article> {
    const article = await this.articleModel.findById(articleId).lean().exec()
    if (!article) throw new NotFoundException(`Article '${articleId}' not found`)
    return article
  }

  // Get article by number id or slug
  public async getDetailByNumberIdOrSlug(params: {
    numberId?: number
    slug?: string
    publicOnly?: boolean
    populate?: boolean
    lean: true
  }): Promise<Article>

  public async getDetailByNumberIdOrSlug(params: {
    numberId?: number
    slug?: string
    publicOnly?: boolean
    populate?: boolean
    lean?: false | undefined
  }): Promise<MongooseDoc<Article>>

  public async getDetailByNumberIdOrSlug({
    numberId,
    slug,
    publicOnly = false,
    populate = false,
    lean = false
  }: {
    numberId?: number
    slug?: string
    publicOnly?: boolean
    populate?: boolean
    lean?: boolean
  }): Promise<Article | MongooseDoc<Article>> {
    const queryFilter: QueryFilter<Article> = {}
    if (slug) queryFilter.slug = slug
    if (numberId) queryFilter.id = numberId

    const articleQuery = this.articleModel
      .findOne(publicOnly ? { ...queryFilter, ...ARTICLE_LIST_QUERY_GUEST_FILTER } : queryFilter)
      .populate(populate ? ARTICLE_FULL_QUERY_REF_POPULATE : [])

    const article = lean ? await articleQuery.lean<Article>().exec() : await articleQuery.exec()
    if (!article) throw new NotFoundException(`Article '${numberId ?? slug}' not found`)

    return article
  }

  public async create(newArticle: Article): Promise<MongooseDoc<Article>> {
    if (newArticle.slug) {
      const existedArticle = await this.articleModel.findOne({ slug: newArticle.slug }).lean().exec()
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
      const existedArticle = await this.articleModel.findOne({ slug: newArticle.slug }).lean().exec()
      if (existedArticle && !existedArticle._id.equals(articleId)) {
        throw new ConflictException(`Article slug '${newArticle.slug}' already exists`)
      }
    }

    Reflect.deleteProperty(newArticle, 'stats')
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

  public async batchPatchStatus(articleIds: MongooseId[], status: ArticleStatus) {
    const actionResult = await this.articleModel
      .updateMany({ _id: { $in: articleIds } }, { $set: { status } })
      .exec()
    this.tagService.updateAllTagsCache()
    this.categoryService.updateAllCategoriesCache()
    this.archiveService.updateCache()
    return actionResult
  }

  public async batchDelete(articleIds: MongooseId[]) {
    const articles = await this.articleModel
      .find({ _id: { $in: articleIds } })
      .lean()
      .exec()

    const actionResult = await this.articleModel.deleteMany({ _id: { $in: articleIds } }).exec()
    this.seoService.delete(articles.map((article) => getArticleUrl(article.id)))
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

  public async incrementStatistics(articleId: number, field: keyof ArticleStats) {
    const article = await this.getDetailByNumberIdOrSlug({
      numberId: articleId,
      publicOnly: true
    })
    article.stats[field]++
    article.save({ timestamps: false })
    return article.stats[field]
  }

  public async getTotalStatistics() {
    const [result] = await this.articleModel.aggregate<{
      _id: Types.ObjectId
      totalViews: number
      totalLikes: number
    }>([
      {
        $group: {
          _id: null,
          totalViews: { $sum: '$stats.views' },
          totalLikes: { $sum: '$stats.likes' }
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
    const article = await this.articleModel.findOne({ id: articleId }).lean().exec()
    return Boolean(article && !article.disabled_comments)
  }

  // Update article comments count
  public async updateStatsComments(articleId: number, commentCount: number) {
    const findParams = { id: articleId }
    const patchParams = { $set: { 'stats.comments': commentCount } }
    return this.articleModel.updateOne(findParams, patchParams, { timestamps: false }).exec()
  }
}
