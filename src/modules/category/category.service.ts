/**
 * Category service.
 * @file 分类模块数据服务
 * @module modules/category/service
 * @author Surmon <https://github.com/surmon-china>
 */

import * as lodash from 'lodash';
import * as APP_CONFIG from '@app/app.config';
import * as CACHE_KEY from '@app/constants/cache.constant';
import { PaginateResult, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { CacheService, TCachePromiseIoResult } from '@app/processors/cache/cache.service';
import { TMongooseModel } from '@app/interfaces/mongoose.interface';
import { ESortType, EPublicState, EPublishState } from '@app/interfaces/state.interface';
import { Category } from './category.model';

@Injectable()
export class CategoryService {

  private categoryListCache: TCachePromiseIoResult;

  constructor(
    @InjectModel(Category) private readonly categoryModel: TMongooseModel<Category>,
    private readonly cacheService: CacheService,
  ) {
    this.categoryListCache = this.cacheService.promise({
      ioMode: true,
      key: CACHE_KEY.TAGS,
      promise() {
        const options = { page: 1, limit: 166, sort: { _id: ESortType.Desc }};
        return this.getList.bind(this)(null, options, false);
      },
    });
  }

  // 请求分类列表缓存
  getListCache(): Promise<PaginateResult<Category>> {
    return this.categoryListCache.get();
  }

  // 更新分类列表缓存
  updateListCache(): Promise<PaginateResult<Category>> {
    return this.categoryListCache.update();
  }

  // 更新所有相关服务
  updateExternalService<T>(category: T): T {
    this.updateListCache();
    // this.sitemapService.updateSitemap();
    if ((category as any).slug) {
      // this.seoService.push(`${APP_CONFIG.APP.URL}/category/${category.slug}`);
    }
    return category;
  }

  // 请求分类列表
  getList(querys, options, isAuthenticated): Promise<PaginateResult<Category>> {
    const matchState = { state: EPublishState.Published, public: EPublicState.Public };
    return this.categoryModel.paginate(querys, options).then(categorys => {
      return this.categoryModel.aggregate([
        { $match: isAuthenticated ? null : matchState },
        { $unwind: '$category' },
        { $group: { _id: '$category', num_tutorial: { $sum: 1 }}},
      ]).then(counts => {
        const todoCategorys = lodash.cloneDeep(categorys);
        todoCategorys.docs = todoCategorys.docs.map(category => {
          const finded = counts.find(count => String(count._id) === String(category._id));
          category.count = finded ? finded.num_tutorial : 0;
          return category;
        });
        return todoCategorys;
      });
    });
  }

  // 创建分类
  createItem(newCategory: Category): Promise<Category> {
    return this.categoryModel.find({ slug: newCategory.slug }).then(existedCategorys => {
      return existedCategorys.length
        ? Promise.reject('slug 已被占用')
        : new this.categoryModel(newCategory).save().then(this.updateExternalService);
    });
  }

  // 修改分类
  async putItem(categoryId: Types.ObjectId, newCategory: Category): Promise<Category> {
    return this.categoryModel.findOne({ slug: newCategory.slug }).then(existedCategory => {
      return existedCategory && existedCategory._id !== categoryId
        ? Promise.reject('slug 已被占用')
        : this.categoryModel.findByIdAndUpdate(categoryId, newCategory, { new: true }).then(this.updateExternalService);
    });
  }

  // 删除单个分类
  async deleteItem(categoryId: Types.ObjectId): Promise<any> {
    return this.categoryModel.findByIdAndRemove(categoryId).then(this.updateExternalService);
  }

  // 批量删除分类
  async deleteList(categoryIds: Types.ObjectId[]): Promise<any> {
    return this.categoryModel.deleteMany({ _id: { $in: categoryIds }}).then(this.updateExternalService);
  }
}