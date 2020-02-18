/**
 * Article module.
 * @file 文章模块
 * @module module/article/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { Module } from '@nestjs/common';
import { SyndicationModule } from '@app/modules/syndication/syndication.module';
import { CategoryModule } from '@app/modules/category/category.module';
import { TagModule } from '@app/modules/tag/tag.module';
import { ArticleController } from './article.controller';
import { ArticleProvider } from './article.model';
import { ArticleService } from './article.service';

@Module({
  imports: [
    TagModule,
    CategoryModule,
    SyndicationModule,
  ],
  controllers: [ArticleController],
  providers: [ArticleProvider, ArticleService],
  exports: [ArticleService],
})
export class ArticleModule {}
