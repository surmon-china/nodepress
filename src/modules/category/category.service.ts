/**
 * @file Category service
 * @module module/category/service
 * @author Surmon <https://github.com/surmon-china>
 */

import { PaginateResult, Types } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@app/transformers/model.transformer'
import { getCategoryUrl } from '@app/transformers/urlmap.transformer'
import { MongooseModel } from '@app/interfaces/mongoose.interface'
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

  // 请求分类列表（及聚和数据）
  public async getList(querys, options, isAuthenticated): Promise<PaginateResult<Category>> {
    const matchState = {
      state: PublishState.Published,
      public: PublicState.Public,
    }

    const categories = await this.categoryModel.paginate(querys, options)
    const counts = await this.articleModel.aggregate([
      { $match: isAuthenticated ? {} : matchState },
      { $unwind: '$category' },
      { $group: { _id: '$category', num_tutorial: { $sum: 1 } } },
    ])

    const categoriesObject = JSON.parse(JSON.stringify(categories))
    const newDocs = categoriesObject.docs.map((category) => {
      const finded = counts.find((count) => String(count._id) === String(category._id))
      return {
        ...category,
        count: finded ? finded.num_tutorial : 0,
      }
    })

    return { ...categoriesObject, docs: newDocs }
  }

  // 创建分类
  public async create(newCategory: Category): Promise<Category> {
    // 检测 slug 重复
    const categories = await this.categoryModel.find({ slug: newCategory.slug }).exec()
    if (categories.length) {
      throw '别名已被占用'
    }

    const category = await this.categoryModel.create(newCategory)
    this.seoService.push(getCategoryUrl(category.slug))
    this.archiveService.updateCache()
    return category
  }

  // 获取分类族谱
  public getGenealogyById(categoryID: Types.ObjectId): Promise<Category[]> {
    const categories = []
    const findById = this.categoryModel.findById.bind(this.categoryModel)

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

  // 获取标签详情（使用别名）
  public getDetailBySlug(slug: string): Promise<Category> {
    return this.categoryModel.findOne({ slug }).exec()
  }

  // 修改分类
  public async update(categoryID: Types.ObjectId, newCategory: Category): Promise<Category> {
    // 检测 slug 重复
    const existedCategory = await this.categoryModel.findOne({ slug: newCategory.slug }).exec()
    if (existedCategory && String(existedCategory._id) !== String(categoryID)) {
      throw '别名已被占用'
    }

    const category = await this.categoryModel.findByIdAndUpdate(categoryID, newCategory as any, {
      new: true,
    })
    this.seoService.push(getCategoryUrl(category.slug))
    this.archiveService.updateCache()
    return category
  }

  // 删除单个分类
  public async delete(categoryID: Types.ObjectId) {
    const category = await this.categoryModel.findByIdAndRemove(categoryID).exec()
    // 更新网站地图
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

  // 批量删除分类（有顺序要求）
  public async batchDelete(categoryIDs: Types.ObjectId[]) {
    // 先删缓存
    const categories = await this.categoryModel.find({ _id: { $in: categoryIDs } }).exec()
    this.seoService.delete(categories.map((category) => getCategoryUrl(category.slug)))

    // 再物理删除
    const actionResult = await this.categoryModel.deleteMany({ _id: { $in: categoryIDs } }).exec()
    this.archiveService.updateCache()
    return actionResult
  }
}
