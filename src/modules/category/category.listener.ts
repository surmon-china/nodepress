/**
 * @file Category event listeners
 * @module module/category/listener
 * @author Surmon <https://github.com/surmon-china>
 */

import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { GlobalEventKey } from '@app/constants/events.constant'
import { CategoryService } from './category.service'

@Injectable()
export class CategoryListener {
  constructor(private readonly categoryService: CategoryService) {}

  @OnEvent(GlobalEventKey.ArticleCreated, { async: true })
  @OnEvent(GlobalEventKey.ArticleUpdated, { async: true })
  @OnEvent(GlobalEventKey.ArticleDeleted, { async: true })
  @OnEvent(GlobalEventKey.ArticlesStatusChanged, { async: true })
  @OnEvent(GlobalEventKey.ArticlesDeleted, { async: true })
  async handleAnyArticleChanged() {
    await this.categoryService.updateAllPublicCategoriesCache()
  }
}
