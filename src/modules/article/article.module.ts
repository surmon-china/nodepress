/**
 * @file Article module
 * @module module/article/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { Module } from '@nestjs/common'
import { ArchiveModule } from '@app/modules/archive/archive.module'
import { CategoryModule } from '@app/modules/category/category.module'
import { TagModule } from '@app/modules/tag/tag.module'
import { ArticleController } from './article.controller'
import { ArticleProvider } from './article.model'
import { ArticleService } from './article.service'
import { ArticleListener } from './article.listener'

@Module({
  imports: [ArchiveModule, CategoryModule, TagModule],
  controllers: [ArticleController],
  providers: [ArticleProvider, ArticleService, ArticleListener],
  exports: [ArticleService]
})
export class ArticleModule {}
