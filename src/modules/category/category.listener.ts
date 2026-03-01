/**
 * @file Category event listeners
 * @module module/category/listener
 * @author Surmon <https://github.com/surmon-china>
 */

import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { EventKeys } from '@app/constants/events.constant'
import { CategoryService } from './category.service'

@Injectable()
export class CategoryListener {
  constructor(private readonly categoryService: CategoryService) {}

  @OnEvent(EventKeys.ArticleCreated, { async: true })
  @OnEvent(EventKeys.ArticleUpdated, { async: true })
  @OnEvent(EventKeys.ArticleDeleted, { async: true })
  @OnEvent(EventKeys.ArticlesStatusChanged, { async: true })
  @OnEvent(EventKeys.ArticlesDeleted, { async: true })
  async handleAnyArticleChanged() {
    await this.categoryService.updateAllPublicCategoriesCache()
  }
}
