/**
 * @file Category service
 * @module module/category/service
 * @author Surmon <https://github.com/surmon-china>
 */

import { Injectable } from '@nestjs/common'
import { InjectModel } from '@app/transformers/model.transformer'
import { getCategoryUrl } from '@app/transformers/urlmap.transformer'
import { MongooseModel, MongooseDoc, MongooseID, MongooseObjectID } from '@app/interfaces/mongoose.interface'
import { PaginateResult, PaginateQuery, PaginateOptions } from '@app/utils/paginate'
import { ArchiveService } from '@app/modules/archive/archive.service'
import { SeoService } from '@app/processors/helper/helper.service.seo'
import { Article, ARTICLE_LIST_QUERY_GUEST_FILTER } from '@app/modules/article/article.model'
import { Category } from './category.model'

@Injectable()
export class CategoryService {
  constructor(
    private readonly seoService: SeoService,
    private readonly archiveService: ArchiveService,
    @InjectModel(Article) private readonly articleModel: MongooseModel<Article>,
    @InjectModel(Category) private readonly categoryModel: MongooseModel<Category>
  ) {}

  public async paginator(
    query: PaginateQuery<Category>,
    options: PaginateOptions,
    publicOnly: boolean
  ): Promise<PaginateResult<Category>> {
    const categories = await this.categoryModel.paginate(query, { ...options, lean: true })
    const counts = await this.articleModel.aggregate<{ _id: MongooseObjectID; count: number }>([
      { $match: publicOnly ? ARTICLE_LIST_QUERY_GUEST_FILTER : {} },
      { $unwind: '$categories' },
      { $group: { _id: '$categories', count: { $sum: 1 } } }
    ])

    const hydratedDocs = categories.documents.map((category) => {
      const found = counts.find((item) => item._id.equals(category._id))
      return { ...category, article_count: found ? found.count : 0 } as Category
    })

    return { ...categories, documents: hydratedDocs }
  }

  // get detail by slug
  public getDetailBySlug(slug: string): Promise<MongooseDoc<Category>> {
    return this.categoryModel
      .findOne({ slug })
      .exec()
      .then((result) => result || Promise.reject(`Category '${slug}' not found`))
  }

  // create category
  public async create(newCategory: Category): Promise<MongooseDoc<Category>> {
    const existedCategory = await this.categoryModel.findOne({ slug: newCategory.slug }).exec()
    if (existedCategory) {
      throw `Category slug '${newCategory.slug}' is existed`
    }

    const category = await this.categoryModel.create(newCategory)
    this.seoService.push(getCategoryUrl(category.slug))
    this.archiveService.updateCache()
    return category
  }

  // get categories genealogy
  public getGenealogyById(categoryID: MongooseID): Promise<Category[]> {
    const categories: Category[] = []
    const findById = (id: MongooseID) => this.categoryModel.findById(id).exec()

    return new Promise((resolve, reject) => {
      ;(function findCateItem(id) {
        findById(id)
          .then((category) => {
            if (!category) {
              if (id === categoryID) {
                return reject(`Category '${categoryID}' not found`)
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
      })(categoryID)
    })
  }

  // update category
  public async update(categoryID: MongooseID, newCategory: Category): Promise<MongooseDoc<Category>> {
    const existedCategory = await this.categoryModel.findOne({ slug: newCategory.slug }).exec()
    if (existedCategory && !existedCategory._id.equals(categoryID)) {
      throw `Category slug '${newCategory.slug}' is existed`
    }

    const category = await this.categoryModel.findByIdAndUpdate(categoryID, newCategory, { new: true }).exec()
    if (!category) {
      throw `Category '${categoryID}' not found`
    }
    this.seoService.push(getCategoryUrl(category.slug))
    this.archiveService.updateCache()
    return category
  }

  // delete category
  public async delete(categoryID: MongooseID) {
    const category = await this.categoryModel.findByIdAndRemove(categoryID).exec()
    if (!category) {
      throw `Category '${categoryID}' not found`
    }

    // cache
    this.archiveService.updateCache()
    this.seoService.delete(getCategoryUrl(category.slug))
    // children categories
    const categories = await this.categoryModel.find({ pid: categoryID }).exec()
    // delete when root category -> { pid: target.id }
    if (!categories.length) {
      return category
    }
    // recursive delete parents -> { pid: target.id } -> { pid: target.pid || null }
    await this.categoryModel.collection
      .initializeOrderedBulkOp()
      .find({ _id: { $in: Array.from(categories, (c) => c._id) } })
      .update({ $set: { pid: category.pid || null } })
      .execute()
    return category
  }

  public async batchDelete(categoryIDs: MongooseID[]) {
    // SEO remove
    const categories = await this.categoryModel.find({ _id: { $in: categoryIDs } }).exec()
    this.seoService.delete(categories.map((category) => getCategoryUrl(category.slug)))
    // DB remove
    const actionResult = await this.categoryModel.deleteMany({ _id: { $in: categoryIDs } }).exec()
    this.archiveService.updateCache()
    return actionResult
  }
}
