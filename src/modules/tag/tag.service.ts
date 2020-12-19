/**
 * Tag service.
 * @file 标签模块数据服务
 * @module module/tag/service
 * @author Surmon <https://github.com/surmon-china>
 */

import * as CACHE_KEY from '@app/constants/cache.constant';
import { PaginateResult, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@app/transformers/model.transformer';
import { getTagUrl } from '@app/transformers/urlmap.transformer';
import { CacheService, ICacheIoResult } from '@app/processors/cache/cache.service';
import { SeoService } from '@app/processors/helper/helper.service.seo';
import { MongooseModel } from '@app/interfaces/mongoose.interface';
import { ESortType, EPublicState, EPublishState } from '@app/interfaces/state.interface';
import { SyndicationService } from '@app/modules/syndication/syndication.service';
import { Article } from '@app/modules/article/article.model';
import { Tag } from './tag.model';

@Injectable()
export class TagService {

  // 为非鉴权用户所用
  private tagListCache: ICacheIoResult<PaginateResult<Tag>>;

  constructor(
    private readonly cacheService: CacheService,
    private readonly syndicationService: SyndicationService,
    private readonly seoService: SeoService,
    @InjectModel(Tag) private readonly tagModel: MongooseModel<Tag>,
    @InjectModel(Article) private readonly articleModel: MongooseModel<Article>,
  ) {
    this.tagListCache = this.cacheService.promise({
      ioMode: true,
      key: CACHE_KEY.TAGS,
      promise: this.getListCacheTask.bind(this),
    });
    this.updateListCache();
  }

  // 缓存任务
  private getListCacheTask(): Promise<PaginateResult<Tag>> {
    const options = {
      page: 1,
      limit: 888,
      sort: { _id: ESortType.Desc },
    };
    return this.getList(null, options, false);
  }

  // 请求标签列表缓存
  public getListCache(): Promise<PaginateResult<Tag>> {
    return this.tagListCache.get();
  }

  // 更新标签列表缓存
  public updateListCache(): Promise<PaginateResult<Tag>> {
    return this.tagListCache.update();
  }

  // 请求标签列表（及聚和数据）
  public async getList(querys, options, isAuthenticated): Promise<PaginateResult<Tag>> {
    const matchState = {
      state: EPublishState.Published,
      public: EPublicState.Public,
    };

    const tags = await this.tagModel.paginate(querys, options);
    const counts = await this.articleModel.aggregate([
      { $match: isAuthenticated ? {} : matchState },
      { $unwind: '$tag' },
      { $group: { _id: '$tag', num_tutorial: { $sum: 1 }}},
    ]);

    const tagsObject = JSON.parse(JSON.stringify(tags));
    const newDocs = tagsObject.docs.map(tag => {
      const found = counts.find(count => (
        String(count._id) === String(tag._id)
      ));
      return {
        ...tag,
        count: found ? found.num_tutorial : 0
      };
    });

    return { ...tagsObject, docs: newDocs };
  }

  // 创建标签
  public async create(newTag: Tag): Promise<Tag> {
    const existedTags = await this.tagModel.find({ slug: newTag.slug }).exec();
    if (existedTags.length) {
      throw '别名已被占用';
    }

    const tag = await this.tagModel.create(newTag);
    this.seoService.push(getTagUrl(tag.slug));
    this.syndicationService.updateCache();
    this.updateListCache();
    return tag;
  }

  // 获取标签详情
  public getDetailBySlug(slug: string): Promise<Tag> {
    return this.tagModel.findOne({ slug }).exec();
  }

  // 修改标签
  public async update(tagId: Types.ObjectId, newTag: Tag): Promise<Tag> {
    const existedTag = await this.tagModel.findOne({ slug: newTag.slug }).exec();
    if (existedTag && String(existedTag._id) !== String(tagId)) {
      throw '别名已被占用';
    }

    const tag = await this.tagModel
      .findByIdAndUpdate(tagId, newTag, { new: true })
      .exec();
    this.seoService.push(getTagUrl(tag.slug));
    this.syndicationService.updateCache();
    this.updateListCache();
    return tag;
  }

  // 删除单个标签
  public async delete(tagId: Types.ObjectId): Promise<Tag> {
    const tag = await this.tagModel.findByIdAndRemove(tagId).exec();
    this.seoService.delete(getTagUrl(tag.slug));
    this.syndicationService.updateCache();
    this.updateListCache();
    return tag;
  }

  // 批量删除标签
  public async batchDelete(tagIds: Types.ObjectId[]) {
    const tags = await this.tagModel.find({ _id: { $in: tagIds }}).exec();
    this.seoService.delete(tags.map(tag => getTagUrl(tag.slug)));

    const actionResult = await this.tagModel
      .deleteMany({ _id: { $in: tagIds }})
      .exec();
    this.syndicationService.updateCache();
    this.updateListCache();
    return actionResult;
  }
}
