/**
 * @file Tag module
 * @module module/tag/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { Module } from '@nestjs/common'
import { ArchiveModule } from '@app/modules/archive/archive.module'
import { ArticleProvider } from '@app/modules/article/article.model'
import { TagController } from './tag.controller'
import { TagProvider } from './tag.model'
import { TagService } from './tag.service'

@Module({
  imports: [ArchiveModule],
  controllers: [TagController],
  providers: [ArticleProvider, TagProvider, TagService],
  exports: [TagService],
})
export class TagModule {}
