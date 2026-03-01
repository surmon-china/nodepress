/**
 * @file Article event listeners
 * @module module/article/listener
 * @author Surmon <https://github.com/surmon-china>
 */

import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { EventKeys } from '@app/constants/events.constant'
import { MongooseId } from '@app/interfaces/mongoose.interface'
import { ArticleService } from './article.service'
import { ArticleSyncService } from './article.service.sync'

@Injectable()
export class ArticleListener {
  constructor(
    private readonly articleService: ArticleService,
    private readonly articleSyncService: ArticleSyncService
  ) {}

  @OnEvent(EventKeys.TagUpdated, { async: true })
  @OnEvent(EventKeys.CategoryUpdated, { async: true })
  async handleRelationalDataUpdated() {
    await this.articleService.updateAllPublicArticlesCache()
  }

  @OnEvent(EventKeys.TagDeleted, { async: true })
  @OnEvent(EventKeys.TagsDeleted, { async: true })
  async handleTagsDeleted(tagObjectIds: MongooseId | MongooseId[]) {
    await this.articleSyncService.removeTagsFromAllArticles(tagObjectIds)
    await this.articleService.updateAllPublicArticlesCache()
  }

  @OnEvent(EventKeys.CategoryDeleted, { async: true })
  @OnEvent(EventKeys.CategoriesDeleted, { async: true })
  async handleCategoriesDeleted(categoryObjectIds: MongooseId | MongooseId[]) {
    await this.articleSyncService.removeCategoriesFromAllArticles(categoryObjectIds)
    await this.articleService.updateAllPublicArticlesCache()
  }
}
