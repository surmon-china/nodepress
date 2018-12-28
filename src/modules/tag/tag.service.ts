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
import { CacheService, TCachePromiseIoResult } from '@app/processors/cache/cache.service';
import { ESortType, EPublicState, EPublishState } from '@app/interfaces/state.interface';
import { BaiduSeoService, EBaiduSeoActions } from '@app/processors/helper/helper.baidu-seo.service';
import { Tag } from './tag.model';

@Injectable()
export class TagService {

  private tagListCache: TCachePromiseIoResult;

  constructor(
    private readonly cacheService: CacheService,
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

  // 请求标签列表缓存
  getListCache(): Promise<PaginateResult<Tag>> {
    return this.tagListCache.get();
  }

  // 更新标签列表缓存
  updateListCache(): Promise<PaginateResult<Tag>> {
    return this.tagListCache.update();
  }

  // 更新所有相关服务
  updateExternalService(action?: EBaiduSeoActions) {
    return tag => {
      this.updateListCache();
      // this.sitemapService.updateSitemap();
      if (action) {
        this.baiduSeoService[action](`${APP_CONFIG.APP.URL}/tag/${tag.slug}`);
      }
      return tag;
    };
  }

  // 请求标签列表
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
        : new this.tagModel(newTag).save().then(
            this.updateExternalService(EBaiduSeoActions.Push),
          );
    });
  }

  // 修改标签
  async putItem(tagId: Types.ObjectId, newTag: Tag): Promise<Tag> {
    return this.tagModel.findOne({ slug: newTag.slug }).then(existedTag => {
      return existedTag && existedTag._id !== tagId
        ? Promise.reject('slug 已被占用')
        : this.tagModel.findByIdAndUpdate(tagId, newTag, { new: true }).then(
            this.updateExternalService(EBaiduSeoActions.Update),
          );
    });
  }

  // 删除单个标签
  async deleteItem(tagId: Types.ObjectId): Promise<any> {
    return this.tagModel.findByIdAndRemove(tagId).then(this.updateExternalService());
  }

  // 批量删除标签
  async deleteList(tagIds: Types.ObjectId[]): Promise<any> {
    return this.tagModel.deleteMany({ _id: { $in: tagIds }}).then(this.updateExternalService());
  }
}