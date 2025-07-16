/**
 * @file Category service
 * @module module/category/service
 * @author Surmon <https://github.com/surmon-china>
 */

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { InjectModel } from '@app/transformers/model.transformer'
import { getCategoryUrl } from '@app/transformers/urlmap.transformer'
import type { MongooseModel, MongooseDoc } from '@app/interfaces/mongoose.interface'
import type { MongooseId, MongooseObjectId, WithId } from '@app/interfaces/mongoose.interface'
import { PaginateResult, PaginateQuery, PaginateOptions } from '@app/utils/paginate'
import { CacheService, CacheManualResult } from '@app/core/cache/cache.service'
import { ArchiveService } from '@app/modules/archive/archive.service'
import { SeoService } from '@app/core/helper/helper.service.seo'
import { Article, ARTICLE_LIST_QUERY_GUEST_FILTER } from '@app/modules/article/article.model'
import { CacheKeys } from '@app/constants/cache.constant'
import { SortType } from '@app/constants/biz.constant'
import { createLogger } from '@app/utils/logger'
import { isDevEnv } from '@app/app.environment'
import { Category } from './category.model'

const logger = createLogger({ scope: 'CategoryService', time: isDevEnv })

@Injectable()
export class CategoryService {
  private allCategoriesCache: CacheManualResult<Array<Category>>

  constructor(
    private readonly seoService: SeoService,
    private readonly cacheService: CacheService,
    private readonly archiveService: ArchiveService,
    @InjectModel(Article) private readonly articleModel: MongooseModel<Article>,
    @InjectModel(Category) private readonly categoryModel: MongooseModel<Category>
  ) {
    this.allCategoriesCache = this.cacheService.manual<Array<Category>>({
      key: CacheKeys.AllCategories,
      promise: () => this.getAllCategories({ aggregatePublicOnly: true })
    })
    this.allCategoriesCache.update().catch((error) => {
      logger.warn('init getAllCategories failed!', error)
    })
  }

  private async aggregateArticleCount(publicOnly: boolean, categories: Array<WithId<Category>>) {
    const counts = await this.articleModel.aggregate<{ _id: MongooseObjectId; count: number }>([
      { $match: publicOnly ? ARTICLE_LIST_QUERY_GUEST_FILTER : {} },
      { $unwind: '$categories' },
      { $group: { _id: '$categories', count: { $sum: 1 } } }
    ])
    return categories.map<Category>((category) => {
      const found = counts.find((item) => item._id.equals(category._id))
      return { ...category, article_count: found ? found.count : 0 }
    })
  }

  public async getAllCategories(options: { aggregatePublicOnly: boolean }): Promise<Array<Category>> {
    const allCategories = await this.categoryModel.find().lean().sort({ _id: SortType.Desc }).exec()
    return await this.aggregateArticleCount(options.aggregatePublicOnly, allCategories)
  }

  public getAllCategoriesCache(): Promise<Array<Category>> {
    return this.allCategoriesCache.get()
  }

  public updateAllCategoriesCache(): Promise<Array<Category>> {
    return this.allCategoriesCache.update()
  }

  public async paginate(
    query: PaginateQuery<Category>,
    options: PaginateOptions,
    publicOnly: boolean
  ): Promise<PaginateResult<Category>> {
    const categories = await this.categoryModel.paginate(query, { ...options, lean: true })
    const documents = await this.aggregateArticleCount(publicOnly, categories.documents)
    return { ...categories, documents }
  }

  // Get detail by slug
  public async getDetailBySlug(slug: string): Promise<MongooseDoc<Category>> {
    const category = await this.categoryModel.findOne({ slug }).exec()
    if (!category) throw new NotFoundException(`Category '${slug}' not found`)
    return category
  }

  // Create category
  public async create(newCategory: Category): Promise<MongooseDoc<Category>> {
    const existedCategory = await this.categoryModel.findOne({ slug: newCategory.slug }).exec()
    if (existedCategory) {
      throw new ConflictException(`Category slug '${newCategory.slug}' already exists`)
    }

    const category = await this.categoryModel.create(newCategory)
    this.seoService.push(getCategoryUrl(category.slug))
    this.archiveService.updateCache()
    this.updateAllCategoriesCache()
    return category
  }

  // Get categories genealogy
  public getGenealogyById(categoryId: MongooseId): Promise<Category[]> {
    const categories: Category[] = []
    const findById = (id: MongooseId) => this.categoryModel.findById(id).exec()

    return new Promise((resolve, reject) => {
      ;(function findCateItem(id) {
        findById(id)
          .then((category) => {
            if (!category) {
              if (id === categoryId) {
                return reject(new NotFoundException(`Category '${categoryId}' not found`))
              } else {
                return resolve(categories)
              }
            }
            categories.unshift(category.toObject())
            const parentId = category.pid
            const hasParent = parentId && parentId.toString() !== category._id.toString()
            return hasParent ? findCateItem(parentId) : resolve(categories)
          })
          .catch(reject)
      })(categoryId)
    })
  }

  // Update category
  public async update(categoryId: MongooseId, newCategory: Category): Promise<MongooseDoc<Category>> {
    const existedCategory = await this.categoryModel.findOne({ slug: newCategory.slug }).exec()
    if (existedCategory && !existedCategory._id.equals(categoryId)) {
      throw new ConflictException(`Category slug '${newCategory.slug}' already exists`)
    }

    const category = await this.categoryModel.findByIdAndUpdate(categoryId, newCategory, { new: true }).exec()
    if (!category) throw new NotFoundException(`Category '${categoryId}' not found`)
    this.seoService.push(getCategoryUrl(category.slug))
    this.archiveService.updateCache()
    this.updateAllCategoriesCache()
    return category
  }

  // Delete category
  public async delete(categoryId: MongooseId) {
    const category = await this.categoryModel.findByIdAndDelete(categoryId, null).exec()
    if (!category) throw new NotFoundException(`Category '${categoryId}' not found`)

    // cache
    this.archiveService.updateCache()
    this.seoService.delete(getCategoryUrl(category.slug))
    this.updateAllCategoriesCache()
    // children categories
    const categories = await this.categoryModel.find({ pid: categoryId }).exec()
    // delete when root category -> { pid: target.id }
    if (!categories.length) return category
    // recursive delete parents -> { pid: target.id } -> { pid: target.pid || null }
    await this.categoryModel.collection
      .initializeOrderedBulkOp()
      .find({ _id: { $in: Array.from(categories, (c) => c._id) } })
      .update({ $set: { pid: category.pid || null } })
      .execute()
    return category
  }

  public async batchDelete(categoryIds: MongooseId[]) {
    // SEO remove
    const categories = await this.categoryModel.find({ _id: { $in: categoryIds } }).exec()
    this.seoService.delete(categories.map((category) => getCategoryUrl(category.slug)))
    // DB remove
    const actionResult = await this.categoryModel.deleteMany({ _id: { $in: categoryIds } }).exec()
    this.archiveService.updateCache()
    this.updateAllCategoriesCache()
    return actionResult
  }
}
