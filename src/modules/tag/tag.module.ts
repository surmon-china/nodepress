/**
 * Tag module.
 * @file 标签模块
 * @module module/tag/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { Module } from '@nestjs/common';
import { SitemapModule } from '@app/modules/sitemap/sitemap.module';
import { ArticleProvider } from '@app/modules/article/article.model';
import { TagController } from './tag.controller';
import { TagProvider } from './tag.model';
import { TagService } from './tag.service';

@Module({
  imports: [SitemapModule],
  controllers: [TagController],
  providers: [ArticleProvider, TagProvider, TagService],
  exports: [TagService],
})
export class TagModule {}
