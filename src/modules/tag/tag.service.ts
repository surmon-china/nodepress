/**
 * Tag service.
 * @file 标签模块数据服务
 * @module modules/tag/service
 * @author Surmon <https://github.com/surmon-china>
 */

import * as lodash from 'lodash';
import * as APP_CONFIG from '@app/app.config';
import * as CACHE_KEY from '@app/constants/cache.constant';
import { PaginateResult, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { TMongooseModel } from '@app/interfaces/mongoose.interface';
import { SitemapService } from '@app/modules/sitemap/sitemap.service';
import { CacheService, TCachePromiseIoResult } from '@app/processors/cache/cache.service';
import { ESortType, EPublicState, EPublishState } from '@app/interfaces/state.interface';
import { BaiduSeoService } from '@app/processors/helper/helper.service.baidu-seo';
import { Tag } from './tag.model';

@Injectable()
export class TagService {

  // 为非鉴权用户所用
  private tagListCache: TCachePromiseIoResult;

  constructor(
    private readonly cacheService: CacheService,
    private readonly sitemapService: SitemapService,
    private readonly baiduSeoService: BaiduSeoService,
    @InjectModel(Tag) private readonly tagModel: TMongooseModel<Tag>,
  ) {
    const promiseTask = () => {
      const options = { page: 1, limit: 166, sort: { _id: ESortType.Desc }};
      return this.getList.bind(this)(null, options, false);
    };
    this.tagListCache = this.cacheService.promise({
      ioMode: true,
      key: CACHE_KEY.TAGS,
      promise: promiseTask,
    });
  }

  // 构造链接
  private buildSeoUrl(slug: string): string {
    return `${APP_CONFIG.APP.URL}/tag/${slug}`;
  }

  // 更新所有内容相关服务
  private updateContentExternalService(): void {
    this.updateListCache();
    this.sitemapService.updateSitemap();
  }

  // 请求标签列表缓存
  getListCache(): Promise<PaginateResult<Tag>> {
    return this.tagListCache.get();
  }

  // 更新标签列表缓存
  updateListCache(): Promise<PaginateResult<Tag>> {
    return this.tagListCache.update();
  }

  // 请求标签列表（及聚和数据）
  getList(querys, options, isAuthenticated): Promise<PaginateResult<Tag>> {
    const matchState = { state: EPublishState.Published, public: EPublicState.Public };
    return this.tagModel.paginate(querys, options).then(tags => {
      return this.tagModel.aggregate([
        { $match: isAuthenticated ? null : matchState },
        { $unwind: '$tag' },
        { $group: { _id: '$tag', num_tutorial: { $sum: 1 }}},
      ]).then(counts => {
        const todoTags = lodash.cloneDeep(tags);
        todoTags.docs = todoTags.docs.map(tag => {
          const finded = counts.find(count => String(count._id) === String(tag._id));
          tag.count = finded ? finded.num_tutorial : 0;
          return tag;
        });
        return todoTags;
      });
    });
  }

  // 创建标签
  createItem(newTag: Tag): Promise<Tag> {
    return this.tagModel.find({ slug: newTag.slug }).then(existedTags => {
      return existedTags.length
        ? Promise.reject('slug 已被占用')
        : new this.tagModel(newTag).save().then(tag => {
            this.baiduSeoService.push(this.buildSeoUrl(tag.slug));
            this.updateContentExternalService();
            return tag;
          });
    });
  }

  // 修改标签
  async putItem(tagId: Types.ObjectId, newTag: Tag): Promise<Tag> {
    return this.tagModel.findOne({ slug: newTag.slug }).then(existedTag => {
      return existedTag && existedTag._id !== tagId
        ? Promise.reject('slug 已被占用')
        : this.tagModel.findByIdAndUpdate(tagId, newTag, { new: true }).then(tag => {
            this.baiduSeoService.push(this.buildSeoUrl(tag.slug));
            this.updateContentExternalService();
            return tag;
          });
    });
  }

  // 删除单个标签
  async deleteItem(tagId: Types.ObjectId): Promise<any> {
    return this.tagModel.findByIdAndRemove(tagId).then(tag => {
      this.baiduSeoService.delete(this.buildSeoUrl(tag.slug));
      this.updateContentExternalService();
      return tag;
    });
  }

  // 批量删除标签
  async deleteList(tagIds: Types.ObjectId[]): Promise<any> {
    return this.tagModel.find({ _id: { $in: tagIds }}).then(tags => {
      this.baiduSeoService.delete(tags.map(tag => this.buildSeoUrl(tag.slug)));
      return this.tagModel.deleteMany({ _id: { $in: tagIds }}).then(result => {
        this.updateContentExternalService();
        return result;
      });
    });
  }
}