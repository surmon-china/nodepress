/**
 * @file Article service
 * @module module/article/service
 * @author Surmon <https://github.com/surmon-china>
 */

import type { QueryFilter } from 'mongoose'
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { MongooseModel } from '@app/interfaces/mongoose.interface'
import { InjectModel } from '@app/transformers/model.transformer'
import { SortOrder } from '@app/constants/sort.constant'
import { SeoService } from '@app/core/helper/helper.service.seo'
import { ArchiveService } from '@app/modules/archive/archive.service'
import { CategoryService } from '@app/modules/category/category.service'
import { TagService } from '@app/modules/tag/tag.service'
import { PaginateOptions, PaginateResult } from '@app/utils/paginate'
import { getArticleUrl } from '@app/transformers/urlmap.transformer'
import { ArticleStatus, ARTICLE_PUBLIC_FILTER } from './article.constant'
import { Article, ArticlePopulated, ArticleDoc, ArticleDocPopulated } from './article.model'
import { ARTICLE_RELATION_FIELDS, ARTICLE_WITH_CONTENT_PROJECTION } from './article.model'
import { CreateArticleDto, UpdateArticleDto } from './article.dto'

@Injectable()
export class ArticleService {
  constructor(
    private readonly seoService: SeoService,
    private readonly tagService: TagService,
    private readonly categoryService: CategoryService,
    private readonly archiveService: ArchiveService,
    @InjectModel(Article) private readonly articleModel: MongooseModel<Article>
  ) {}

  public paginate(filter: QueryFilter<Article>, options: PaginateOptions): Promise<PaginateResult<Article>> {
    return this.articleModel.paginateRaw(filter, {
      ...options,
      populate: ARTICLE_RELATION_FIELDS
    })
  }

  // Get all articles
  // MARK: Providing this capability only for admin. (Consumes a lot of computing resources.)
  public getAll(): Promise<Article[]> {
    return this.articleModel.find({}, null, {
      sort: { created_at: SortOrder.Desc },
      populate: ARTICLE_RELATION_FIELDS,
      projection: ARTICLE_WITH_CONTENT_PROJECTION
    })
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
      .select(ARTICLE_WITH_CONTENT_PROJECTION)

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
    this.seoService.push(getArticleUrl(created.id))
    this.tagService.updateAllPublicTagsCache()
    this.categoryService.updateAllPublicCategoriesCache()
    this.archiveService.updateCache()
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

    this.seoService.update(getArticleUrl(updated.id))
    this.tagService.updateAllPublicTagsCache()
    this.categoryService.updateAllPublicCategoriesCache()
    this.archiveService.updateCache()
    return updated
  }

  public async delete(articleId: number) {
    const deleted = await this.articleModel.findOneAndDelete({ id: articleId }).exec()
    if (!deleted) throw new NotFoundException(`Article '${articleId}' not found`)

    this.seoService.delete(getArticleUrl(deleted.id))
    this.tagService.updateAllPublicTagsCache()
    this.categoryService.updateAllPublicCategoriesCache()
    this.archiveService.updateCache()
    return deleted
  }

  public async batchUpdateStatus(articleIds: number[], status: ArticleStatus) {
    const actionResult = await this.articleModel
      .updateMany({ id: { $in: articleIds } }, { $set: { status } })
      .exec()
    this.tagService.updateAllPublicTagsCache()
    this.categoryService.updateAllPublicCategoriesCache()
    this.archiveService.updateCache()
    return actionResult
  }

  public async batchDelete(articleIds: number[]) {
    const articles = await this.articleModel
      .find({ id: { $in: articleIds } })
      .lean()
      .exec()

    const actionResult = await this.articleModel.deleteMany({ id: { $in: articleIds } }).exec()
    this.seoService.delete(articles.map((article) => getArticleUrl(article.id)))
    this.tagService.updateAllPublicTagsCache()
    this.categoryService.updateAllPublicCategoriesCache()
    this.archiveService.updateCache()
    return actionResult
  }

  // Article commentable state
  public async isCommentableArticle(articleId: number): Promise<boolean> {
    const article = await this.articleModel.findOne({ id: articleId }).lean().exec()
    return Boolean(article && !article.disabled_comments)
  }
}
