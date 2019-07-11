/**
 * Category module.
 * @file 分类模块
 * @module module/category/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { Module } from '@nestjs/common';
import { SitemapModule } from '@app/modules/sitemap/sitemap.module';
import { ArticleProvider } from '@app/modules/article/article.model';
import { CategoryController } from './category.controller';
import { CategoryProvider } from './category.model';
import { CategoryService } from './category.service';

@Module({
  imports: [SitemapModule],
  controllers: [CategoryController],
  providers: [
    ArticleProvider,
    CategoryProvider,
    CategoryService,
  ],
  exports: [CategoryService],
})
export class CategoryModule {}
