/**
 * @file Archive service
 * @module module/archive/service
 * @author Surmon <https://github.com/surmon-china>
 */

import { Injectable, OnModuleInit } from '@nestjs/common'
import { CacheService, CacheManualResult } from '@app/core/cache/cache.service'
import { InjectModel } from '@app/transformers/model.transformer'
import { MongooseModel } from '@app/interfaces/mongoose.interface'
import { CacheKeys } from '@app/constants/cache.constant'
import { SortOrder } from '@app/constants/sort.constant'
import { ARTICLE_PUBLIC_FILTER } from '@app/modules/article/article.constant'
import { Article } from '@app/modules/article/article.model'
import { Category } from '@app/modules/category/category.model'
import { Tag } from '@app/modules/tag/tag.model'
import { createLogger } from '@app/utils/logger'
import { isDevEnv } from '@app/app.environment'

const logger = createLogger({ scope: 'ArchiveService', time: isDevEnv })

export interface ArchiveData {
  tags: Tag[]
  categories: Category[]
  articles: Article[]
}

@Injectable()
export class ArchiveService implements OnModuleInit {
  private archiveCache: CacheManualResult<ArchiveData>

  constructor(
    private readonly cacheService: CacheService,
    @InjectModel(Tag) private readonly tagModel: MongooseModel<Tag>,
    @InjectModel(Article) private readonly articleModel: MongooseModel<Article>,
    @InjectModel(Category) private readonly categoryModel: MongooseModel<Category>
  ) {
    this.archiveCache = this.cacheService.manual({
      key: CacheKeys.Archive,
      promise: () => this.getArchiveData()
    })
  }

  onModuleInit() {
    this.archiveCache.update().catch((error) => {
      logger.warn('Init getArchiveData failed!', error)
    })
  }

  public getCache(): Promise<ArchiveData> {
    return this.archiveCache.get()
  }

  public updateCache(): Promise<ArchiveData> {
    return this.archiveCache.update()
  }

  private async getArchiveData(): Promise<ArchiveData> {
    try {
      const [tags, categories, articles] = await Promise.all([
        this.tagModel.find().sort({ created_at: SortOrder.Desc }).lean().exec(),
        this.categoryModel.find().sort({ created_at: SortOrder.Desc }).lean().exec(),
        this.articleModel.find(ARTICLE_PUBLIC_FILTER).sort({ created_at: SortOrder.Desc }).lean().exec()
      ])
      return { tags, categories, articles }
    } catch (error) {
      logger.warn('getArchiveData failed!', error)
      return {
        tags: [],
        categories: [],
        articles: []
      }
    }
  }
}
