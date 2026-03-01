/**
 * @file Article module
 * @module module/article/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { Module, forwardRef } from '@nestjs/common'
import { CategoryModule } from '@app/modules/category/category.module'
import { TagModule } from '@app/modules/tag/tag.module'
import { ArticleController } from './article.controller'
import { ArticleProvider } from './article.model'
import { ArticleListener } from './article.listener'
import { ArticleService } from './article.service'
import { ArticleContextService } from './article.service.context'
import { ArticleStatsService } from './article.service.stats'
import { ArticleSyncService } from './article.service.sync'

@Module({
  imports: [forwardRef(() => CategoryModule), forwardRef(() => TagModule)],
  controllers: [ArticleController],
  providers: [
    ArticleProvider,
    ArticleListener,
    ArticleService,
    ArticleContextService,
    ArticleStatsService,
    ArticleSyncService
  ],
  exports: [ArticleService, ArticleContextService, ArticleStatsService, ArticleSyncService]
})
export class ArticleModule {}
