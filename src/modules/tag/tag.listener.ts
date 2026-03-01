/**
 * @file Tag event listeners
 * @module module/tag/listener
 * @author Surmon <https://github.com/surmon-china>
 */

import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { EventKeys } from '@app/constants/events.constant'
import { TagService } from './tag.service'

@Injectable()
export class TagListener {
  constructor(private readonly tagService: TagService) {}

  @OnEvent(EventKeys.ArticleCreated, { async: true })
  @OnEvent(EventKeys.ArticleUpdated, { async: true })
  @OnEvent(EventKeys.ArticleDeleted, { async: true })
  @OnEvent(EventKeys.ArticlesStatusChanged, { async: true })
  @OnEvent(EventKeys.ArticlesDeleted, { async: true })
  async handleAnyArticleChanged() {
    await this.tagService.updateAllPublicTagsCache()
  }
}
