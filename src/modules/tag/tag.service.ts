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
  public getList(querys, options, isAuthenticated): Promise<PaginateResult<Tag>> {
    const matchState = {
      state: EPublishState.Published,
      public: EPublicState.Public,
    };

    return this.tagModel
      .paginate(querys, options)
      .then(tags => {
        return this.articleModel.aggregate([
          { $match: isAuthenticated ? {} : matchState },
          { $unwind: '$tag' },
          { $group: { _id: '$tag', num_tutorial: { $sum: 1 }}},
        ]).then(counts => {
          tags = JSON.parse(JSON.stringify(tags));
          return Object.assign(tags, {
            docs: tags.docs.map(tag => {
              const finded = counts.find(count => String(count._id) === String(tag._id));
              return Object.assign(tag, { count: finded ? finded.num_tutorial : 0 });
            }),
          });
        });
      });
  }

  // 创建标签
  public create(newTag: Tag): Promise<Tag> {
    return this.tagModel
      .find({ slug: newTag.slug })
      .exec()
      .then(existedTags => {
        return existedTags.length
          ? Promise.reject('别名已被占用')
          : this.tagModel.create(newTag).then(tag => {
              this.seoService.push(getTagUrl(tag.slug));
              this.syndicationService.updateCache();
              this.updateListCache();
              return tag;
            });
      });
  }

  // 获取标签详情
  public getDetailBySlug(slug: string): Promise<Tag> {
    return this.tagModel.findOne({ slug }).exec();
  }

  // 修改标签
  public update(tagId: Types.ObjectId, newTag: Tag): Promise<Tag> {
    return this.tagModel
      .findOne({ slug: newTag.slug })
      .exec()
      .then(existedTag => {
        return existedTag && String(existedTag._id) !== String(tagId)
          ? Promise.reject('别名已被占用')
          : this.tagModel
            .findByIdAndUpdate(tagId, newTag, { new: true })
            .exec()
            .then(tag => {
              this.seoService.push(getTagUrl(tag.slug));
              this.syndicationService.updateCache();
              this.updateListCache();
              return tag;
            });
    });
  }

  // 删除单个标签
  public delete(tagId: Types.ObjectId): Promise<Tag> {
    return this.tagModel
      .findByIdAndRemove(tagId)
      .exec()
      .then(tag => {
        this.seoService.delete(getTagUrl(tag.slug));
        this.syndicationService.updateCache();
        this.updateListCache();
        return tag;
      });
  }

  // 批量删除标签
  public batchDelete(tagIds: Types.ObjectId[]): Promise<any> {
    return this.tagModel
      .find({ _id: { $in: tagIds }})
      .exec()
      .then(tags => {
        this.seoService.delete(tags.map(tag => getTagUrl(tag.slug)));
        return this.tagModel
          .deleteMany({ _id: { $in: tagIds }})
          .exec()
          .then(result => {
            this.syndicationService.updateCache();
            this.updateListCache();
            return result;
          });
      });
  }
}
