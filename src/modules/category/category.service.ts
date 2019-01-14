/**
 * Category service.
 * @file 分类模块数据服务
 * @module module/category/service
 * @author Surmon <https://github.com/surmon-china>
 */

import * as APP_CONFIG from '@app/app.config';
import { PaginateResult, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { TMongooseModel } from '@app/interfaces/mongoose.interface';
import { SitemapService } from '@app/modules/sitemap/sitemap.service';
import { BaiduSeoService } from '@app/processors/helper/helper.service.baidu-seo';
import { EPublicState, EPublishState } from '@app/interfaces/state.interface';
import { Article } from '@app/modules/article/article.model';
import { Category } from './category.model';

@Injectable()
export class CategoryService {
  constructor(
    private readonly sitemapService: SitemapService,
    private readonly baiduSeoService: BaiduSeoService,
    @InjectModel(Article) private readonly articleModel: TMongooseModel<Article>,
    @InjectModel(Category) private readonly categoryModel: TMongooseModel<Category>,
  ) {}

  // 构造链接
  private buildSeoUrl(slug: string): string {
    return `${APP_CONFIG.APP.URL}/category/${slug}`;
  }

  // 请求分类列表（及聚和数据）
  public getList(querys, options, isAuthenticated): Promise<PaginateResult<Category>> {
    const matchState = { state: EPublishState.Published, public: EPublicState.Public };
    return this.categoryModel.paginate(querys, options).then(categories => {
      return this.articleModel.aggregate([
        { $match: isAuthenticated ? {} : matchState },
        { $unwind: '$category' },
        { $group: { _id: '$category', num_tutorial: { $sum: 1 }}},
      ]).then(counts => {
        categories = JSON.parse(JSON.stringify(categories));
        return Object.assign(categories, {
          docs: categories.docs.map(category => {
            const finded = counts.find(count => String(count._id) === String(category._id));
            return Object.assign(category, { count: finded ? finded.num_tutorial : 0 });
          }),
        });
      });
    });
  }

  // 创建分类
  public create(newCategory: Category): Promise<Category> {
    return this.categoryModel.find({ slug: newCategory.slug }).exec().then(categories => {
      return categories.length
        ? Promise.reject('别名已被占用')
        : new this.categoryModel(newCategory).save().then(category => {
            this.baiduSeoService.push(this.buildSeoUrl(category.slug));
            this.sitemapService.updateCache();
            return category;
          });
    });
  }

  // 获取分类族谱
  public getGenealogyById(categoryId: Types.ObjectId): Promise<Category[]> {
    const categories = [];
    const findById = this.categoryModel.findById.bind(this.categoryModel);
    return new Promise((resolve, reject) => {
      ((function findCateItem(id) {
        findById(id)
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

  // 获取标签详情（使用别名）
  public getDetailBySlug(slug: string): Promise<Category> {
    return this.categoryModel.findOne({ slug }).exec();
  }

  // 修改分类
  public update(categoryId: Types.ObjectId, newCategory: Category): Promise<Category> {
    return this.categoryModel.findOne({ slug: newCategory.slug }).exec().then(existedCategory => {
      return existedCategory && String(existedCategory._id) !== String(categoryId)
        ? Promise.reject('别名已被占用')
        : this.categoryModel.findByIdAndUpdate(categoryId, newCategory, { new: true }).then(category => {
            this.baiduSeoService.push(this.buildSeoUrl(category.slug));
            this.sitemapService.updateCache();
            return category;
          });
    });
  }

  // 删除单个分类
  public delete(categoryId: Types.ObjectId): Promise<Category> {
    return this.categoryModel.findByIdAndRemove(categoryId).exec().then(category => {
      // 更新网站地图
      this.sitemapService.updateCache();
      this.baiduSeoService.delete(this.buildSeoUrl(category.slug));
      return this.categoryModel.find({ pid: categoryId }).exec().then(categories => {
        // 如果没有此分类的父分类，则删除 { pid: target.id } -> ok
        if (!categories.length) {
          return Promise.resolve(category);
        }
        // 否则递归更改 -> { pid: target.id } -> { pid: target.pid || null }
        const bulk = this.categoryModel.collection.initializeOrderedBulkOp();
        bulk
          .find({ _id: { $in: Array.from(categories, c => c._id) }})
          .update({ $set: { pid: category.pid || null }});
        return bulk.execute().then(_ => category);
      });
    });
  }

  // 批量删除分类
  public batchDelete(categoryIds: Types.ObjectId[]): Promise<any> {
    return this.categoryModel.find({ _id: { $in: categoryIds }}).exec().then(categories => {
      this.baiduSeoService.delete(categories.map(category => this.buildSeoUrl(category.slug)));
      return this.categoryModel.deleteMany({ _id: { $in: categoryIds }}).exec().then(result => {
        this.sitemapService.updateCache();
        return result;
      });
    });
  }
}
