/**
 * @file Tag service
 * @module module/tag/service
 * @author Surmon <https://github.com/surmon-china>
 */

import { Injectable } from '@nestjs/common'
import { InjectModel } from '@app/transformers/model.transformer'
import { getTagUrl } from '@app/transformers/urlmap.transformer'
import { MongooseModel, MongooseDoc, MongooseID, MongooseObjectID, WithID } from '@app/interfaces/mongoose.interface'
import { CacheService, CacheManualResult } from '@app/processors/cache/cache.service'
import { SeoService } from '@app/processors/helper/helper.service.seo'
import { ArchiveService } from '@app/modules/archive/archive.service'
import { PaginateResult, PaginateQuery, PaginateOptions } from '@app/utils/paginate'
import { Article, ARTICLE_LIST_QUERY_GUEST_FILTER } from '@app/modules/article/article.model'
import { CacheKeys } from '@app/constants/cache.constant'
import { SortType } from '@app/constants/biz.constant'
import { createLogger } from '@app/utils/logger'
import { isDevEnv } from '@app/app.environment'
import { Tag } from './tag.model'

const logger = createLogger({ scope: 'TagService', time: isDevEnv })

@Injectable()
export class TagService {
  private allTagsCache: CacheManualResult<Array<Tag>>

  constructor(
    private readonly seoService: SeoService,
    private readonly cacheService: CacheService,
    private readonly archiveService: ArchiveService,
    @InjectModel(Tag) private readonly tagModel: MongooseModel<Tag>,
    @InjectModel(Article) private readonly articleModel: MongooseModel<Article>
  ) {
    this.allTagsCache = this.cacheService.manual<Array<Tag>>({
      key: CacheKeys.AllTags,
      promise: () => this.getAllTags({ aggregatePublicOnly: true })
    })

    this.allTagsCache.update().catch((error) => {
      logger.warn('init getAllTags failed!', error)
    })
  }

  private async aggregateArticleCount(publicOnly: boolean, tags: Array<WithID<Tag>>) {
    const counts = await this.articleModel.aggregate<{ _id: MongooseObjectID; count: number }>([
      { $match: publicOnly ? ARTICLE_LIST_QUERY_GUEST_FILTER : {} },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } }
    ])
    return tags.map<Tag>((tag) => {
      const found = counts.find((item) => item._id.equals(tag._id))
      return { ...tag, article_count: found ? found.count : 0 }
    })
  }

  public async getAllTags(options: { aggregatePublicOnly: boolean }): Promise<Array<Tag>> {
    const allTags = await this.tagModel.find().lean().sort({ _id: SortType.Desc }).exec()
    return await this.aggregateArticleCount(options.aggregatePublicOnly, allTags)
  }

  public getAllTagsCache(): Promise<Array<Tag>> {
    return this.allTagsCache.get()
  }

  public updateAllTagsCache(): Promise<Array<Tag>> {
    return this.allTagsCache.update()
  }

  public async paginator(
    query: PaginateQuery<Tag>,
    options: PaginateOptions,
    publicOnly: boolean
  ): Promise<PaginateResult<Tag>> {
    const tags = await this.tagModel.paginate(query, { ...options, lean: true })
    const documents = await this.aggregateArticleCount(publicOnly, tags.documents)
    return { ...tags, documents }
  }

  public getDetailBySlug(slug: string): Promise<MongooseDoc<Tag>> {
    return this.tagModel
      .findOne({ slug })
      .exec()
      .then((result) => result || Promise.reject(`Tag '${slug}' not found`))
  }

  public async create(newTag: Tag): Promise<MongooseDoc<Tag>> {
    const existedTag = await this.tagModel.findOne({ slug: newTag.slug }).exec()
    if (existedTag) {
      throw `Tag slug '${newTag.slug}' is existed`
    }

    const tag = await this.tagModel.create(newTag)
    this.seoService.push(getTagUrl(tag.slug))
    this.archiveService.updateCache()
    this.updateAllTagsCache()
    return tag
  }

  public async update(tagID: MongooseID, newTag: Tag): Promise<MongooseDoc<Tag>> {
    const existedTag = await this.tagModel.findOne({ slug: newTag.slug }).exec()
    if (existedTag && !existedTag._id.equals(tagID)) {
      throw `Tag slug '${newTag.slug}' is existed`
    }

    const tag = await this.tagModel.findByIdAndUpdate(tagID, newTag as any, { new: true }).exec()
    if (!tag) {
      throw `Tag '${tagID}' not found`
    }

    this.seoService.push(getTagUrl(tag.slug))
    this.archiveService.updateCache()
    this.updateAllTagsCache()
    return tag
  }

  public async delete(tagID: MongooseID) {
    const tag = await this.tagModel.findByIdAndDelete(tagID, null).exec()
    if (!tag) {
      throw `Tag '${tagID}' not found`
    }

    this.seoService.delete(getTagUrl(tag.slug))
    this.archiveService.updateCache()
    this.updateAllTagsCache()
    return tag
  }

  public async batchDelete(tagIDs: MongooseID[]) {
    const tags = await this.tagModel.find({ _id: { $in: tagIDs } }).exec()
    // DB remove
    const actionResult = await this.tagModel.deleteMany({ _id: { $in: tagIDs } }).exec()
    // Cache update
    this.archiveService.updateCache()
    this.updateAllTagsCache()
    // SEO remove
    this.seoService.delete(tags.map((tag) => getTagUrl(tag.slug)))
    return actionResult
  }

  public async getTotalCount(): Promise<number> {
    return await this.tagModel.countDocuments().exec()
  }
}
