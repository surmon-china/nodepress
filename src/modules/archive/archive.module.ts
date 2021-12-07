/**
 * @file Archive module
 * @module module/archive/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { Module } from '@nestjs/common'
import { CategoryProvider } from '@app/modules/category/category.model'
import { ArticleProvider } from '@app/modules/article/article.model'
import { TagProvider } from '@app/modules/tag/tag.model'
import { ArchiveController } from './archive.controller'
import { ArchiveService } from './archive.service'

@Module({
  controllers: [ArchiveController],
  providers: [TagProvider, CategoryProvider, ArticleProvider, ArchiveService],
  exports: [ArchiveService],
})
export class ArchiveModule {}
