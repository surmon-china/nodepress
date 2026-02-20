/**
 * @file Category service
 * @module module/category/service
 * @author Surmon <https://github.com/surmon-china>
 */

import type { QueryFilter } from 'mongoose'
import { Injectable, OnModuleInit, NotFoundException, ConflictException } from '@nestjs/common'
import { InjectModel } from '@app/transformers/model.transformer'
import { MongooseModel, MongooseDoc, MongooseId, WithId } from '@app/interfaces/mongoose.interface'
import { PaginateOptions, PaginateResult } from '@app/utils/paginate'
import { CacheService, CacheManualResult } from '@app/core/cache/cache.service'
import { ArchiveService } from '@app/modules/archive/archive.service'
import { SeoService } from '@app/core/helper/helper.service.seo'
import { Article } from '@app/modules/article/article.model'
import { ARTICLE_PUBLIC_FILTER } from '@app/modules/article/article.constant'
import { CacheKeys } from '@app/constants/cache.constant'
import { SortOrder } from '@app/constants/sort.constant'
import { getCategoryUrl } from '@app/transformers/urlmap.transformer'
import { createLogger } from '@app/utils/logger'
import { isDevEnv } from '@app/app.environment'
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto'
import { Category } from './category.model'

const logger = createLogger({ scope: 'CategoryService', time: isDevEnv })

@Injectable()
export class CategoryService implements OnModuleInit {
  private allPublicCategoriesCache: CacheManualResult<Array<Category>>

  constructor(
    private readonly seoService: SeoService,
    private readonly cacheService: CacheService,
    private readonly archiveService: ArchiveService,
    @InjectModel(Article) private readonly articleModel: MongooseModel<Article>,
    @InjectModel(Category) private readonly categoryModel: MongooseModel<Category>
  ) {
    this.allPublicCategoriesCache = this.cacheService.manual<Array<Category>>({
      key: CacheKeys.AllCategories,
      promise: () => this.getAllCategories({ aggregatePublicOnly: true })
    })
  }

  onModuleInit() {
    this.allPublicCategoriesCache.update().catch((error) => {
      logger.warn('Init getAllCategories failed!', error)
    })
  }

  public getAllPublicCategoriesCache(): Promise<Array<Category>> {
    return this.allPublicCategoriesCache.get()
  }

  public updateAllPublicCategoriesCache(): Promise<Array<Category>> {
    return this.allPublicCategoriesCache.update()
  }

  private async aggregateArticleCount(categories: Array<WithId<Category>>, publicOnly: boolean) {
    if (!categories.length) return []
    const categoryIds = categories.map((c) => c._id)
    const matchStage = publicOnly ? { ...ARTICLE_PUBLIC_FILTER } : {}
    const counts = await this.articleModel.aggregate<{ _id: MongooseId; count: number }>([
      { $match: { categories: { $in: categoryIds }, ...matchStage } },
      { $unwind: '$categories' },
      { $match: { categories: { $in: categoryIds } } },
      { $group: { _id: '$categories', count: { $sum: 1 } } }
    ])
    const countMap = new Map(counts.map((c) => [c._id.toString(), c.count]))
    return categories.map<Category>((category) => ({
      ...category,
      article_count: countMap.get(category._id.toString()) ?? 0
    }))
  }

  public async paginate(
    filter: QueryFilter<Category>,
    options: PaginateOptions,
    publicOnly: boolean
  ): Promise<PaginateResult<Category>> {
    const result = await this.categoryModel.paginateRaw(filter, options)
    const documents = await this.aggregateArticleCount(result.documents, publicOnly)
    return { ...result, documents }
  }

  public async getAllCategories(options: { aggregatePublicOnly: boolean }): Promise<Array<Category>> {
    const allCategories = await this.categoryModel.find().lean().sort({ _id: SortOrder.Desc }).exec()
    return await this.aggregateArticleCount(allCategories, options.aggregatePublicOnly)
  }

  public async getDetail(idOrSlug: number | string): Promise<WithId<Category>> {
    const category = await this.categoryModel
      .findOne(typeof idOrSlug === 'number' ? { id: idOrSlug } : { slug: idOrSlug })
      .lean()
      .exec()
    if (!category) throw new NotFoundException(`Category '${idOrSlug}' not found`)
    return category
  }

  public async create(input: CreateCategoryDto): Promise<MongooseDoc<Category>> {
    const existed = await this.categoryModel.findOne({ slug: input.slug }).lean().exec()
    if (existed) {
      throw new ConflictException(`Category slug '${input.slug}' already exists`)
    }

    const created = await this.categoryModel.create(input)
    this.updateAllPublicCategoriesCache()
    this.archiveService.updateCache()
    this.seoService.push(getCategoryUrl(created.slug))
    return created
  }

  public async update(categoryId: number, input: UpdateCategoryDto): Promise<MongooseDoc<Category>> {
    const existed = await this.categoryModel.findOne({ slug: input.slug }).lean().exec()
    if (existed && existed.id !== categoryId) {
      throw new ConflictException(`Category slug '${input.slug}' already exists`)
    }

    const updated = await this.categoryModel
      .findOneAndUpdate({ id: categoryId }, { $set: input }, { returnDocument: 'after' })
      .exec()
    if (!updated) throw new NotFoundException(`Category '${categoryId}' not found`)

    this.updateAllPublicCategoriesCache()
    this.archiveService.updateCache()
    this.seoService.push(getCategoryUrl(updated.slug))
    return updated
  }

  public async delete(categoryId: number): Promise<MongooseDoc<Category>> {
    const deleted = await this.categoryModel.findOneAndDelete({ id: categoryId }).exec()
    if (!deleted) throw new NotFoundException(`Category '${categoryId}' not found`)

    // Reassign `parent_id` for subcategories to prevent hierarchy breakage
    await this.categoryModel
      .updateMany({ parent_id: deleted.id }, { $set: { parent_id: deleted.parent_id || null } })
      .exec()

    // Remove this category ID from all associated articles
    await this.articleModel.updateMany({ categories: deleted._id }, { $pull: { categories: deleted._id } }).exec()

    // effects
    this.updateAllPublicCategoriesCache()
    this.archiveService.updateCache()
    this.seoService.delete(getCategoryUrl(deleted.slug))
    return deleted
  }

  public async batchDelete(categoryIds: number[]) {
    const categories = await this.categoryModel
      .find({ id: { $in: categoryIds } })
      .lean()
      .exec()

    // DB remove
    const actionResult = await this.categoryModel.deleteMany({ id: { $in: categoryIds } }).exec()
    // Reassign parent_id for subcategories to prevent hierarchy breakage
    await this.categoryModel.updateMany({ parent_id: { $in: categoryIds } }, { $set: { parent_id: null } }).exec()
    // Remove this category ID from all associated articles
    const categoryObjectIds = categories.map((category) => category._id)
    await this.articleModel
      .updateMany({ categories: { $in: categoryObjectIds } }, { $pull: { categories: { $in: categoryObjectIds } } })
      .exec()

    // effects
    this.updateAllPublicCategoriesCache()
    this.archiveService.updateCache()
    this.seoService.delete(categories.map((category) => getCategoryUrl(category.slug)))
    return actionResult
  }
}
