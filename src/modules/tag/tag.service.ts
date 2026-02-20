/**
 * @file Tag service
 * @module module/tag/service
 * @author Surmon <https://github.com/surmon-china>
 */

import type { QueryFilter } from 'mongoose'
import { Injectable, OnModuleInit, NotFoundException, ConflictException } from '@nestjs/common'
import { InjectModel } from '@app/transformers/model.transformer'
import type { MongooseModel, MongooseDoc } from '@app/interfaces/mongoose.interface'
import type { MongooseId, WithId } from '@app/interfaces/mongoose.interface'
import { CacheService, CacheManualResult } from '@app/core/cache/cache.service'
import { SeoService } from '@app/core/helper/helper.service.seo'
import { ArchiveService } from '@app/modules/archive/archive.service'
import { PaginateResult, PaginateOptions } from '@app/utils/paginate'
import { ARTICLE_PUBLIC_FILTER } from '@app/modules/article/article.constant'
import { Article } from '@app/modules/article/article.model'
import { CacheKeys } from '@app/constants/cache.constant'
import { SortOrder } from '@app/constants/sort.constant'
import { getTagUrl } from '@app/transformers/urlmap.transformer'
import { createLogger } from '@app/utils/logger'
import { isDevEnv } from '@app/app.environment'
import { CreateTagDto, UpdateTagDto } from './tag.dto'
import { Tag } from './tag.model'

const logger = createLogger({ scope: 'TagService', time: isDevEnv })

@Injectable()
export class TagService implements OnModuleInit {
  private allPublicTagsCache: CacheManualResult<Array<Tag>>

  constructor(
    private readonly seoService: SeoService,
    private readonly cacheService: CacheService,
    private readonly archiveService: ArchiveService,
    @InjectModel(Tag) private readonly tagModel: MongooseModel<Tag>,
    @InjectModel(Article) private readonly articleModel: MongooseModel<Article>
  ) {
    this.allPublicTagsCache = this.cacheService.manual<Array<Tag>>({
      key: CacheKeys.AllTags,
      promise: () => this.getAllTags({ aggregatePublicOnly: true })
    })
  }

  onModuleInit() {
    this.allPublicTagsCache.update().catch((error) => {
      logger.warn('Init getAllTags failed!', error)
    })
  }

  public getAllPublicTagsCache(): Promise<Array<Tag>> {
    return this.allPublicTagsCache.get()
  }

  public updateAllPublicTagsCache(): Promise<Array<Tag>> {
    return this.allPublicTagsCache.update()
  }

  private async aggregateArticleCount(tags: Array<WithId<Tag>>, publicOnly: boolean) {
    if (!tags.length) return []
    const tagIds = tags.map((c) => c._id)
    const matchStage = publicOnly ? { ...ARTICLE_PUBLIC_FILTER } : {}
    const counts = await this.articleModel.aggregate<{ _id: MongooseId; count: number }>([
      { $match: { tags: { $in: tagIds }, ...matchStage } },
      { $unwind: '$tags' },
      { $match: { tags: { $in: tagIds } } },
      { $group: { _id: '$tags', count: { $sum: 1 } } }
    ])
    const countMap = new Map(counts.map((c) => [c._id.toString(), c.count]))
    return tags.map<Tag>((tag) => ({
      ...tag,
      article_count: countMap.get(tag._id.toString()) ?? 0
    }))
  }

  public async paginate(
    filter: QueryFilter<Tag>,
    options: PaginateOptions,
    publicOnly: boolean
  ): Promise<PaginateResult<Tag>> {
    const result = await this.tagModel.paginateRaw(filter, options)
    const documents = await this.aggregateArticleCount(result.documents, publicOnly)
    return { ...result, documents }
  }

  public async getAllTags(options: { aggregatePublicOnly: boolean }): Promise<Array<Tag>> {
    const allTags = await this.tagModel.find().lean().sort({ _id: SortOrder.Desc }).exec()
    return await this.aggregateArticleCount(allTags, options.aggregatePublicOnly)
  }

  public async getTotalCount(): Promise<number> {
    return await this.tagModel.countDocuments().lean().exec()
  }

  public async getDetail(idOrSlug: number | string): Promise<WithId<Tag>> {
    const tag = await this.tagModel
      .findOne(typeof idOrSlug === 'number' ? { id: idOrSlug } : { slug: idOrSlug })
      .lean()
      .exec()
    if (!tag) throw new NotFoundException(`Tag '${idOrSlug}' not found`)
    return tag
  }

  public async create(input: CreateTagDto): Promise<MongooseDoc<Tag>> {
    const existed = await this.tagModel.findOne({ slug: input.slug }).lean().exec()
    if (existed) throw new ConflictException(`Tag slug '${input.slug}' already exists`)

    const created = await this.tagModel.create(input)
    this.updateAllPublicTagsCache()
    this.archiveService.updateCache()
    this.seoService.push(getTagUrl(created.slug))
    return created
  }

  public async update(tagId: number, input: UpdateTagDto): Promise<MongooseDoc<Tag>> {
    const existed = await this.tagModel.findOne({ slug: input.slug }).lean().exec()
    if (existed && existed.id !== tagId) {
      throw new ConflictException(`Tag slug '${input.slug}' already exists`)
    }

    const updated = await this.tagModel
      .findOneAndUpdate({ id: tagId }, { $set: input }, { returnDocument: 'after' })
      .exec()
    if (!updated) throw new NotFoundException(`Tag '${tagId}' not found`)

    this.updateAllPublicTagsCache()
    this.archiveService.updateCache()
    this.seoService.push(getTagUrl(updated.slug))
    return updated
  }

  public async delete(tagId: number) {
    const deleted = await this.tagModel.findOneAndDelete({ id: tagId }).exec()
    if (!deleted) throw new NotFoundException(`Tag '${tagId}' not found`)

    // Remove this Tag ID from all associated articles
    await this.articleModel.updateMany({ tags: deleted._id }, { $pull: { tags: deleted._id } }).exec()

    this.updateAllPublicTagsCache()
    this.archiveService.updateCache()
    this.seoService.delete(getTagUrl(deleted.slug))
    return deleted
  }

  public async batchDelete(tagIds: number[]) {
    const tags = await this.tagModel
      .find({ id: { $in: tagIds } })
      .lean()
      .exec()

    // DB remove
    const actionResult = await this.tagModel.deleteMany({ id: { $in: tagIds } }).exec()
    // Remove this Tag ID from all associated articles
    const tagObjectIds = tags.map((tag) => tag._id)
    await this.articleModel
      .updateMany({ tags: { $in: tagObjectIds } }, { $pull: { tags: { $in: tagObjectIds } } })
      .exec()

    // effects
    this.updateAllPublicTagsCache()
    this.archiveService.updateCache()
    this.seoService.delete(tags.map((tag) => getTagUrl(tag.slug)))
    return actionResult
  }
}
