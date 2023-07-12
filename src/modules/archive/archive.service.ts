/**
 * @file Archive service
 * @module module/archive/service
 * @author Surmon <https://github.com/surmon-china>
 */

import { Injectable } from '@nestjs/common'
import { InjectModel } from '@app/transformers/model.transformer'
import { CacheService, CacheManualResult } from '@app/processors/cache/cache.service'
import { MongooseModel } from '@app/interfaces/mongoose.interface'
import { SortType } from '@app/constants/biz.constant'
import { Category } from '@app/modules/category/category.model'
import {
  Article,
  ARTICLE_LIST_QUERY_GUEST_FILTER,
  ARTICLE_LIST_QUERY_PROJECTION
} from '@app/modules/article/article.model'
import { Tag } from '@app/modules/tag/tag.model'
import * as CACHE_KEY from '@app/constants/cache.constant'
import logger from '@app/utils/logger'

const log = logger.scope('ArchiveService')

export interface ArchiveData {
  tags: Tag[]
  categories: Category[]
  articles: Article[]
}

@Injectable()
export class ArchiveService {
  private archiveCache: CacheManualResult<ArchiveData>

  constructor(
    private readonly cacheService: CacheService,
    @InjectModel(Tag) private readonly tagModel: MongooseModel<Tag>,
    @InjectModel(Article) private readonly articleModel: MongooseModel<Article>,
    @InjectModel(Category) private readonly categoryModel: MongooseModel<Category>
  ) {
    this.archiveCache = this.cacheService.manual({
      key: CACHE_KEY.ARCHIVE,
      promise: this.getArchiveData.bind(this)
    })
    this.updateCache().catch((error) => {
      log.warn('init getArchiveData failed!', error)
    })
  }

  private getAllTags(): Promise<Tag[]> {
    return this.tagModel.find().sort({ _id: SortType.Desc }).exec()
  }

  private getAllCategories(): Promise<Category[]> {
    return this.categoryModel.find().sort({ _id: SortType.Desc }).exec()
  }

  private getAllArticles(): Promise<Article[]> {
    return this.articleModel
      .find(ARTICLE_LIST_QUERY_GUEST_FILTER, ARTICLE_LIST_QUERY_PROJECTION)
      .sort({ _id: SortType.Desc })
      .exec()
  }

  private async getArchiveData(): Promise<ArchiveData> {
    try {
      const [tags, categories, articles] = await Promise.all([
        this.getAllTags(),
        this.getAllCategories(),
        this.getAllArticles()
      ])
      return { tags, categories, articles }
    } catch (error) {
      log.warn('getArchiveData failed!', error)
      return {} as any as ArchiveData
    }
  }

  public getCache() {
    return this.archiveCache.get()
  }

  public updateCache() {
    return this.archiveCache.update()
  }
}
