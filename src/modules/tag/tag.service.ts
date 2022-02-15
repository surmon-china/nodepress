/**
 * @file Tag service
 * @module module/tag/service
 * @author Surmon <https://github.com/surmon-china>
 */

import { Types } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@app/transformers/model.transformer'
import { getTagUrl } from '@app/transformers/urlmap.transformer'
import { CacheService, CacheIOResult } from '@app/processors/cache/cache.service'
import { SeoService } from '@app/processors/helper/helper.service.seo'
import { MongooseModel, MongooseDoc, MongooseID } from '@app/interfaces/mongoose.interface'
import { PaginateResult, PaginateQuery, PaginateOptions } from '@app/utils/paginate'
import { SortType } from '@app/interfaces/biz.interface'
import { ArchiveService } from '@app/modules/archive/archive.service'
import { Article, ARTICLE_LIST_QUERY_GUEST_FILTER } from '@app/modules/article/article.model'
import { Tag } from './tag.model'
import * as CACHE_KEY from '@app/constants/cache.constant'
import logger from '@app/utils/logger'

@Injectable()
export class TagService {
  private allTagsCache: CacheIOResult<Array<Tag>>

  constructor(
    private readonly seoService: SeoService,
    private readonly cacheService: CacheService,
    private readonly archiveService: ArchiveService,
    @InjectModel(Tag) private readonly tagModel: MongooseModel<Tag>,
    @InjectModel(Article) private readonly articleModel: MongooseModel<Article>
  ) {
    this.allTagsCache = this.cacheService.promise({
      ioMode: true,
      key: CACHE_KEY.ALL_TAGS,
      promise: () => this.getAllTags(),
    })

    this.updateAllTagsCache().catch((error) => {
      logger.warn('[tag]', 'init tagPaginateCache', error)
    })
  }

  private async aggregate(publicOnly: boolean, documents: Array<Tag>) {
    const counts = await this.articleModel.aggregate<{ _id: Types.ObjectId; count: number }>([
      { $match: publicOnly ? ARTICLE_LIST_QUERY_GUEST_FILTER : {} },
      { $unwind: '$tag' },
      { $group: { _id: '$tag', count: { $sum: 1 } } },
    ])
    const hydratedDocs = documents.map((tag) => {
      const found = counts.find((item) => String(item._id) === String((tag as any)._id))
      return { ...tag, articles_count: found ? found.count : 0 } as Tag
    })
    return hydratedDocs
  }

  public async getAllTags(): Promise<Array<Tag>> {
    const allTags = await this.tagModel.find().lean().sort({ _id: SortType.Desc }).exec()
    const documents = await this.aggregate(true, allTags)
    return documents
  }

  public getAllTagsCache(): Promise<Array<Tag>> {
    return this.allTagsCache.get()
  }

  public updateAllTagsCache(): Promise<Array<Tag>> {
    return this.allTagsCache.update()
  }

  public async paginater(
    querys: PaginateQuery<Tag>,
    options: PaginateOptions,
    publicOnly: boolean
  ): Promise<PaginateResult<Tag>> {
    const tags = await this.tagModel.paginate(querys, { ...options, lean: true })
    const documents = await this.aggregate(publicOnly, tags.documents)
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
    if (existedTag && String(existedTag._id) !== String(tagID)) {
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

  public async delete(tagID: MongooseID): Promise<MongooseDoc<Tag>> {
    const tag = await this.tagModel.findByIdAndRemove(tagID).exec()
    if (!tag) {
      throw `Tag '${tagID}' not found`
    }

    this.seoService.delete(getTagUrl(tag.slug))
    this.archiveService.updateCache()
    this.updateAllTagsCache()
    return tag
  }

  public async batchDelete(tagIDs: MongooseID[]) {
    // SEO remove
    const tags = await this.tagModel.find({ _id: { $in: tagIDs } }).exec()
    this.seoService.delete(tags.map((tag) => getTagUrl(tag.slug)))
    // DB remove
    const actionResult = await this.tagModel.deleteMany({ _id: { $in: tagIDs } }).exec()
    this.archiveService.updateCache()
    this.updateAllTagsCache()
    return actionResult
  }

  public async getTotalCount(): Promise<number> {
    return await this.tagModel.countDocuments().exec()
  }
}
