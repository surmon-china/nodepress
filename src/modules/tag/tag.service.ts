/**
 * @file Tag service
 * @module module/tag/service
 * @author Surmon <https://github.com/surmon-china>
 */

import type { QueryFilter } from 'mongoose'
import { Injectable, OnModuleInit, NotFoundException, ConflictException } from '@nestjs/common'
import { InjectModel } from '@app/transformers/model.transformer'
import type { MongooseModel, MongooseDoc } from '@app/interfaces/mongoose.interface'
import type { MongooseId, MongooseObjectId, WithId } from '@app/interfaces/mongoose.interface'
import { CacheService, CacheManualResult } from '@app/core/cache/cache.service'
import { SeoService } from '@app/core/helper/helper.service.seo'
import { ArchiveService } from '@app/modules/archive/archive.service'
import { PaginateResult, PaginateOptions } from '@app/utils/paginate'
import { ARTICLE_LIST_QUERY_GUEST_FILTER } from '@app/modules/article/article.constant'
import { Article } from '@app/modules/article/article.model'
import { CacheKeys } from '@app/constants/cache.constant'
import { SortOrder } from '@app/constants/biz.constant'
import { getTagUrl } from '@app/transformers/urlmap.transformer'
import { createLogger } from '@app/utils/logger'
import { isDevEnv } from '@app/app.environment'
import { Tag } from './tag.model'

const logger = createLogger({ scope: 'TagService', time: isDevEnv })

@Injectable()
export class TagService implements OnModuleInit {
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
  }

  onModuleInit() {
    this.allTagsCache.update().catch((error) => {
      logger.warn('Init getAllTags failed!', error)
    })
  }

  private async aggregateArticleCount(publicOnly: boolean, tags: Array<WithId<Tag>>) {
    const counts = await this.articleModel.aggregate<{ _id: MongooseObjectId; count: number }>([
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
    const allTags = await this.tagModel.find().lean().sort({ _id: SortOrder.Desc }).exec()
    return await this.aggregateArticleCount(options.aggregatePublicOnly, allTags)
  }

  public getAllTagsCache(): Promise<Array<Tag>> {
    return this.allTagsCache.get()
  }

  public updateAllTagsCache(): Promise<Array<Tag>> {
    return this.allTagsCache.update()
  }

  public async paginate(
    filter: QueryFilter<Tag>,
    options: PaginateOptions,
    publicOnly: boolean
  ): Promise<PaginateResult<Tag>> {
    const result = await this.tagModel.paginateRaw(filter, options)
    const documents = await this.aggregateArticleCount(publicOnly, result.documents)
    return { ...result, documents }
  }

  public async getDetailBySlug(slug: string): Promise<WithId<Tag>> {
    const tag = await this.tagModel.findOne({ slug }).lean().exec()
    if (!tag) throw new NotFoundException(`Tag '${slug}' not found`)
    return tag
  }

  public async create(newTag: Tag): Promise<MongooseDoc<Tag>> {
    const existedTag = await this.tagModel.findOne({ slug: newTag.slug }).lean().exec()
    if (existedTag) throw new ConflictException(`Tag slug '${newTag.slug}' already exists`)

    const tag = await this.tagModel.create(newTag)
    this.seoService.push(getTagUrl(tag.slug))
    this.archiveService.updateCache()
    this.updateAllTagsCache()
    return tag
  }

  public async update(tagId: MongooseId, newTag: Tag): Promise<MongooseDoc<Tag>> {
    const existedTag = await this.tagModel.findOne({ slug: newTag.slug }).lean().exec()
    if (existedTag && !existedTag._id.equals(tagId)) {
      throw new ConflictException(`Tag slug '${newTag.slug}' already exists`)
    }

    const updated = await this.tagModel.findByIdAndUpdate(tagId, newTag as any, { new: true }).exec()
    if (!updated) throw new NotFoundException(`Tag '${tagId}' not found`)

    this.seoService.push(getTagUrl(updated.slug))
    this.archiveService.updateCache()
    this.updateAllTagsCache()
    return updated
  }

  public async delete(tagId: MongooseId) {
    const deleted = await this.tagModel.findByIdAndDelete(tagId, null).exec()
    if (!deleted) throw new NotFoundException(`Tag '${tagId}' not found`)

    this.seoService.delete(getTagUrl(deleted.slug))
    this.archiveService.updateCache()
    this.updateAllTagsCache()
    return deleted
  }

  public async batchDelete(tagIds: MongooseId[]) {
    const tags = await this.tagModel.find({ _id: { $in: tagIds } }).exec()
    // DB remove
    const actionResult = await this.tagModel.deleteMany({ _id: { $in: tagIds } }).exec()
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
