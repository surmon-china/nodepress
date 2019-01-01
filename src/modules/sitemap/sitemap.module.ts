/**
 * Sitemap module.
 * @file Sitemap 模块
 * @module modules/sitemap/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { SitemapController } from './sitemap.controller';
import { SitemapService } from './sitemap.service';
import { Category } from '@app/modules/category/category.model';
import { Article } from '@app/modules/article/article.model';
import { Tag } from '@app/modules/tag/tag.model';

@Module({
  imports: [
    TypegooseModule.forFeature(Tag),
    TypegooseModule.forFeature(Article),
    TypegooseModule.forFeature(Category),
  ],
  controllers: [SitemapController],
  providers: [SitemapService],
  exports: [SitemapService],
})
export class SitemapModule {}
