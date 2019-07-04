/**
 * Article module.
 * @file 文章模块
 * @module module/article/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { TagModule } from '@app/modules/tag/tag.module';
import { CategoryModule } from '@app/modules/category/category.module';
import { SitemapModule } from '@app/modules/sitemap/sitemap.module';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { Article } from './article.model';

@Module({
  imports: [
    TagModule,
    CategoryModule,
    SitemapModule,
    TypegooseModule.forFeature([{
      typegooseClass: Article,
      schemaOptions: {
        toObject: { getters: true },
      },
    }]),
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
  exports: [ArticleService],
})
export class ArticleModule {}
