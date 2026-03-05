/**
 * @file Tag event listeners
 * @module module/tag/listener
 * @author Surmon <https://github.com/surmon-china>
 */

import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { GlobalEventKey } from '@app/constants/events.constant'
import { TagService } from './tag.service'

@Injectable()
export class TagListener {
  constructor(private readonly tagService: TagService) {}

  @OnEvent(GlobalEventKey.ArticleCreated, { async: true })
  @OnEvent(GlobalEventKey.ArticleUpdated, { async: true })
  @OnEvent(GlobalEventKey.ArticleDeleted, { async: true })
  @OnEvent(GlobalEventKey.ArticlesStatusChanged, { async: true })
  @OnEvent(GlobalEventKey.ArticlesDeleted, { async: true })
  async handleAnyArticleChanged() {
    await this.tagService.updateAllPublicTagsCache()
  }
}
