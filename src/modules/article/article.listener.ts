/**
 * @file Article event listeners
 * @module module/article/listener
 * @author Surmon <https://github.com/surmon-china>
 */

import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { GlobalEventKey } from '@app/constants/events.constant'
import { MongooseId } from '@app/interfaces/mongoose.interface'
import { ArticleService } from './article.service'
import { ArticleSyncService } from './article.service.sync'

@Injectable()
export class ArticleListener {
  constructor(
    private readonly articleService: ArticleService,
    private readonly articleSyncService: ArticleSyncService
  ) {}

  @OnEvent(GlobalEventKey.TagUpdated, { async: true })
  @OnEvent(GlobalEventKey.CategoryUpdated, { async: true })
  async handleRelationalDataUpdated() {
    await this.articleService.updateAllPublicArticlesCache()
  }

  @OnEvent(GlobalEventKey.TagDeleted, { async: true })
  @OnEvent(GlobalEventKey.TagsDeleted, { async: true })
  async handleTagsDeleted(tagObjectIds: MongooseId | MongooseId[]) {
    await this.articleSyncService.removeTagsFromAllArticles(tagObjectIds)
    await this.articleService.updateAllPublicArticlesCache()
  }

  @OnEvent(GlobalEventKey.CategoryDeleted, { async: true })
  @OnEvent(GlobalEventKey.CategoriesDeleted, { async: true })
  async handleCategoriesDeleted(categoryObjectIds: MongooseId | MongooseId[]) {
    await this.articleSyncService.removeCategoriesFromAllArticles(categoryObjectIds)
    await this.articleService.updateAllPublicArticlesCache()
  }
}
