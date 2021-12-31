/**
 * @file Category service
 * @module module/category/service
 * @author Surmon <https://github.com/surmon-china>
 */

import { Types } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@app/transformers/model.transformer'
import { getCategoryUrl } from '@app/transformers/urlmap.transformer'
import { MongooseModel } from '@app/interfaces/mongoose.interface'
import { PaginateResult, PaginateOptions } from '@app/utils/paginate'
import { PublicState, PublishState } from '@app/interfaces/biz.interface'
import { ArchiveService } from '@app/modules/archive/archive.service'
import { SeoService } from '@app/processors/helper/helper.service.seo'
import { Article } from '@app/modules/article/article.model'
import { Category } from './category.model'

@Injectable()
export class CategoryService {
  constructor(
    private readonly archiveService: ArchiveService,
    private readonly seoService: SeoService,
    @InjectModel(Article) private readonly articleModel: MongooseModel<Article>,
    @InjectModel(Category)
    private readonly categoryModel: MongooseModel<Category>
  ) {}

  public async paginater(querys, options: PaginateOptions, publicOnly: boolean): Promise<PaginateResult<Category>> {
    const matchState = {
      state: PublishState.Published,
      public: PublicState.Public,
    }

    const categories = await this.categoryModel.paginate(querys, { ...options, lean: true })
    const counts = await this.articleModel.aggregate([
      { $match: publicOnly ? matchState : {} },
      { $unwind: '$category' },
      { $group: { _id: '$category', num_tutorial: { $sum: 1 } } },
    ])

    const hydratedDocs = categories.documents.map((category) => {
      const finded = counts.find((count) => String(count._id) === String(category._id))
      return { ...category, count: finded ? finded.num_tutorial : 0 }
    })

    return { ...categories, documents: hydratedDocs }
  }

  // get detail by slug
  public getDetailBySlug(slug: string): Promise<Category> {
    return this.categoryModel
      .findOne({ slug })
      .exec()
      .then((result) => result || Promise.reject(`Category "${slug}" not found`))
  }

  // create category
  public async create(newCategory: Category): Promise<Category> {
    const existedCategory = await this.categoryModel.findOne({ slug: newCategory.slug }).exec()
    if (existedCategory) {
      throw `Category slug "${newCategory.slug}" is existed`
    }

    const category = await this.categoryModel.create(newCategory)
    this.seoService.push(getCategoryUrl(category.slug))
    this.archiveService.updateCache()
    return category
  }

  // get categories genealogy
  public getGenealogyById(categoryID: Types.ObjectId): Promise<Category[]> {
    const categories: Category[] = []
    const findById = (id: Types.ObjectId) => this.categoryModel.findById(id).exec()

    return new Promise((resolve, reject) => {
      ;(function findCateItem(id) {
        findById(id)
          .then((category) => {
            if (!category) {
              return resolve(categories)
            }
            categories.unshift(category)
            const parentId = category.pid
            const hasParent = parentId && parentId !== category.id
            return hasParent ? findCateItem(parentId) : resolve(categories)
          })
          .catch(reject)
      })(categoryID)
    })
  }

  // update category
  public async update(categoryID: Types.ObjectId, newCategory: Category): Promise<Category> {
    const existedCategory = await this.categoryModel.findOne({ slug: newCategory.slug }).exec()
    if (existedCategory && String(existedCategory._id) !== String(categoryID)) {
      throw `Category slug "${newCategory.slug}" is existed`
    }

    const category = await this.categoryModel.findByIdAndUpdate(categoryID, newCategory, { new: true }).exec()
    if (!category) {
      throw `Category "${categoryID}" not found`
    }
    this.seoService.push(getCategoryUrl(category.slug))
    this.archiveService.updateCache()
    return category
  }

  // delete category
  public async delete(categoryID: Types.ObjectId) {
    const category = await this.categoryModel.findByIdAndRemove(categoryID).exec()
    if (!category) {
      throw `Category "${categoryID}" not found`
    }

    // cache
    this.archiveService.updateCache()
    this.seoService.delete(getCategoryUrl(category.slug))
    // 处理子分类
    const categories = await this.categoryModel.find({ pid: categoryID }).exec()
    // 如果没有此分类的父分类，则删除 { pid: target.id } -> ok
    if (!categories.length) {
      return category
    }
    // 否则递归更改 -> { pid: target.id } -> { pid: target.pid || null }
    await this.categoryModel.collection
      .initializeOrderedBulkOp()
      .find({ _id: { $in: Array.from(categories, (c) => c._id) } })
      .update({ $set: { pid: category.pid || null } })
      .execute()

    return category
  }

  public async batchDelete(categoryIDs: Types.ObjectId[]) {
    // SEO remove
    const categories = await this.categoryModel.find({ _id: { $in: categoryIDs } }).exec()
    this.seoService.delete(categories.map((category) => getCategoryUrl(category.slug)))
    // DB remove
    const actionResult = await this.categoryModel.deleteMany({ _id: { $in: categoryIDs } }).exec()
    this.archiveService.updateCache()
    return actionResult
  }
}
