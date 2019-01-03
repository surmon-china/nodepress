/**
 * Category service.
 * @file 分类模块数据服务
 * @module module/category/service
 * @author Surmon <https://github.com/surmon-china>
 */

import * as lodash from 'lodash';
import * as APP_CONFIG from '@app/app.config';
import { PaginateResult, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { TMongooseModel } from '@app/interfaces/mongoose.interface';
import { SitemapService } from '@app/modules/sitemap/sitemap.service';
import { BaiduSeoService } from '@app/processors/helper/helper.service.baidu-seo';
import { EPublicState, EPublishState } from '@app/interfaces/state.interface';
import { Category } from './category.model';

@Injectable()
export class CategoryService {
  constructor(
    private readonly sitemapService: SitemapService,
    private readonly baiduSeoService: BaiduSeoService,
    @InjectModel(Category) private readonly categoryModel: TMongooseModel<Category>,
  ) {}

  // 构造链接
  private buildSeoUrl(slug: string): string {
    return `${APP_CONFIG.APP.URL}/category/${slug}`;
  }

  // 请求分类列表（及聚和数据）
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
        : new this.categoryModel(newCategory).save().then(category => {
            this.baiduSeoService.push(this.buildSeoUrl(category.slug));
            this.sitemapService.updateSitemap();
            return category;
          });
    });
  }

  // 获取单个分类
  async getItem(categoryId: Types.ObjectId): Promise<Category[]> {
    const categories = [];
    return new Promise((resolve, reject) => {
      ((function findCateItem(id) {
        this.categoryModel.findById(id)
          .then(category => {
            if (!category) {
              return resolve(categories);
            }
            categories.unshift(category);
            const parentId = category.pid;
            const hasParent = parentId && parentId !== category.id;
            return hasParent
              ? findCateItem(parentId)
              : resolve(categories);
          })
          .catch(reject);
      })(categoryId));
    });
  }

  // 修改分类
  async putItem(categoryId: Types.ObjectId, newCategory: Category): Promise<Category> {
    return this.categoryModel.findOne({ slug: newCategory.slug }).then(existedCategory => {
      return existedCategory && existedCategory._id !== categoryId
        ? Promise.reject('slug 已被占用')
        : this.categoryModel.findByIdAndUpdate(categoryId, newCategory, { new: true }).then(category => {
            this.baiduSeoService.push(this.buildSeoUrl(category.slug));
            this.sitemapService.updateSitemap();
            return category;
          });
    });
  }

  // 删除单个分类
  async deleteItem(categoryId: Types.ObjectId): Promise<any> {
    return this.categoryModel.findByIdAndRemove(categoryId).then(category => {
      return this.categoryModel.find({ pid: categoryId }).then(categories => {
        // 如果没有此分类的父分类，则删除 { pid: target.id } -> ok
        if (!categories.length) {
          return Promise.resolve(category);
        }
        // 否则递归更改 -> { pid: target.id } -> { pid: target.pid || null }
        return this.categoryModel.collection
          .initializeOrderedBulkOp()
          .find({ _id: { $in: Array.from(categories, c => c._id) }})
          .update({ $set: { pid: category.pid || null }})
          .execute()
          .then(_ => category);
      });
    })
    .then(category => {
      this.sitemapService.updateSitemap();
      return category;
    });
  }

  // 批量删除分类
  async deleteList(categoryIds: Types.ObjectId[]): Promise<any> {
    return this.categoryModel.find({ _id: { $in: categoryIds }}).then(categories => {
      this.baiduSeoService.delete(categories.map(category => this.buildSeoUrl(category.slug)));
      return this.categoryModel.deleteMany({ _id: { $in: categoryIds }}).then(result => {
        this.sitemapService.updateSitemap();
        return result;
      });
    });
  }
}
