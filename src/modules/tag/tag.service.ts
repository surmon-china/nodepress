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
import { MongooseModel } from '@app/interfaces/mongoose.interface'
import { PaginateResult, PaginateOptions } from '@app/utils/paginate'
import { SortType, PublicState, PublishState } from '@app/interfaces/biz.interface'
import { ArchiveService } from '@app/modules/archive/archive.service'
import { Article } from '@app/modules/article/article.model'
import { Tag } from './tag.model'
import * as CACHE_KEY from '@app/constants/cache.constant'
import logger from '@app/utils/logger'

@Injectable()
export class TagService {
  // for client user
  private tagPaginateCache: CacheIOResult<PaginateResult<Tag>>

  constructor(
    private readonly cacheService: CacheService,
    private readonly archiveService: ArchiveService,
    private readonly seoService: SeoService,
    @InjectModel(Tag) private readonly tagModel: MongooseModel<Tag>,
    @InjectModel(Article) private readonly articleModel: MongooseModel<Article>
  ) {
    this.tagPaginateCache = this.cacheService.promise({
      ioMode: true,
      key: CACHE_KEY.TAGS,
      promise: () => {
        const options: Partial<PaginateOptions> = {
          page: 1,
          perPage: 168,
          sort: { _id: SortType.Desc },
        }
        return this.paginater(null, options, true)
      },
    })

    this.updatePaginateCache().catch((error) => {
      logger.warn('[tag]', 'init tagPaginateCache', error)
    })
  }

  public getPaginateCache(): Promise<PaginateResult<Tag>> {
    return this.tagPaginateCache.get()
  }

  public updatePaginateCache(): Promise<PaginateResult<Tag>> {
    return this.tagPaginateCache.update()
  }

  public async paginater(
    querys,
    options: Partial<PaginateOptions>,
    publicOnly: boolean
  ): Promise<PaginateResult<Tag>> {
    const matchState = {
      state: PublishState.Published,
      public: PublicState.Public,
    }

    const tags = await this.tagModel.paginate(querys, { ...options, lean: true })
    const counts = await this.articleModel.aggregate<{ _id: Types.ObjectId; num_tutorial: number }>([
      { $match: publicOnly ? matchState : {} },
      { $unwind: '$tag' },
      { $group: { _id: '$tag', num_tutorial: { $sum: 1 } } },
    ])
    const hydratedDocs = tags.documents.map((tag) => {
      const found = counts.find((count) => String(count._id) === String(tag._id))
      return { ...tag, count: found ? found.num_tutorial : 0 }
    })

    return { ...tags, documents: hydratedDocs }
  }

  public getDetailBySlug(slug: string): Promise<Tag> {
    return this.tagModel
      .findOne({ slug })
      .exec()
      .then((result) => result || Promise.reject(`Tag "${slug}" not found`))
  }

  public async create(newTag: Tag): Promise<Tag> {
    const existedTag = await this.tagModel.findOne({ slug: newTag.slug }).exec()
    if (existedTag) {
      throw `Tag slug "${newTag.slug}" is existed`
    }

    const tag = await this.tagModel.create(newTag)
    this.seoService.push(getTagUrl(tag.slug))
    this.archiveService.updateCache()
    this.updatePaginateCache()
    return tag
  }

  public async update(tagID: Types.ObjectId, newTag: Tag): Promise<Tag> {
    const existedTag = await this.tagModel.findOne({ slug: newTag.slug }).exec()
    if (existedTag && String(existedTag._id) !== String(tagID)) {
      throw `Tag slug "${newTag.slug}" is existed`
    }

    const tag = await this.tagModel.findByIdAndUpdate(tagID, newTag as any, { new: true }).exec()
    if (!tag) {
      throw `Tag "${tagID}" not found`
    }

    this.seoService.push(getTagUrl(tag.slug))
    this.archiveService.updateCache()
    this.updatePaginateCache()
    return tag
  }

  public async delete(tagID: Types.ObjectId): Promise<Tag> {
    const tag = await this.tagModel.findByIdAndRemove(tagID).exec()
    if (!tag) {
      throw `Tag "${tagID}" not found`
    }

    this.seoService.delete(getTagUrl(tag.slug))
    this.archiveService.updateCache()
    this.updatePaginateCache()
    return tag
  }

  public async batchDelete(tagIDs: Types.ObjectId[]) {
    // SEO remove
    const tags = await this.tagModel.find({ _id: { $in: tagIDs } }).exec()
    this.seoService.delete(tags.map((tag) => getTagUrl(tag.slug)))
    // DB remove
    const actionResult = await this.tagModel.deleteMany({ _id: { $in: tagIDs } }).exec()
    this.archiveService.updateCache()
    this.updatePaginateCache()
    return actionResult
  }
}
