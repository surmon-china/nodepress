/**
 * @file Archive service
 * @module module/archive/service
 * @author Surmon <https://github.com/surmon-china>
 */

import { Injectable } from '@nestjs/common'
import { InjectModel } from '@app/transformers/model.transformer'
import { CacheService, CacheIOResult } from '@app/processors/cache/cache.service'
import { SortType, PublishState, PublicState } from '@app/interfaces/biz.interface'
import { MongooseModel } from '@app/interfaces/mongoose.interface'
import { Category } from '@app/modules/category/category.model'
import { Article } from '@app/modules/article/article.model'
import { Tag } from '@app/modules/tag/tag.model'
import * as CACHE_KEY from '@app/constants/cache.constant'
import * as APP_CONFIG from '@app/app.config'
import logger from '@app/utils/logger'

export interface ArchiveData {
  meta: typeof APP_CONFIG.PROJECT
  tags: Tag[]
  categories: Category[]
  articles: Article[]
}

@Injectable()
export class ArchiveService {
  private archiveCache: CacheIOResult<ArchiveData>

  constructor(
    private readonly cacheService: CacheService,
    @InjectModel(Tag) private readonly tagModel: MongooseModel<Tag>,
    @InjectModel(Article) private readonly articleModel: MongooseModel<Article>,
    @InjectModel(Category) private readonly categoryModel: MongooseModel<Category>
  ) {
    this.archiveCache = this.cacheService.promise({
      ioMode: true,
      key: CACHE_KEY.ARCHIVE,
      promise: this.getArchiveData.bind(this),
    })
    this.updateCache().catch((error) => {
      logger.warn('[archive]', 'init getArchiveData Error:', error)
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
      .find({ state: PublishState.Published, public: PublicState.Public }, null, {
        select: '-password -content',
      })
      .sort({ _id: SortType.Desc })
      .exec()
  }

  private async getArchiveData(): Promise<ArchiveData> {
    try {
      return {
        meta: APP_CONFIG.PROJECT,
        tags: await this.getAllTags(),
        categories: await this.getAllCategories(),
        articles: await this.getAllArticles(),
      }
    } catch (error) {
      logger.warn('[archive]', 'getArchiveData Error:', error)
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
