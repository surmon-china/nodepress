/**
 * Syndication module.
 * @file Syndication 模块
 * @module module/syndication/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { Module } from '@nestjs/common';
import { CategoryProvider } from '@app/modules/category/category.model';
import { ArticleProvider } from '@app/modules/article/article.model';
import { TagProvider } from '@app/modules/tag/tag.model';
import { SyndicationController } from './syndication.controller';
import { SyndicationService } from './syndication.service';

@Module({
  controllers: [SyndicationController],
  providers: [
    TagProvider,
    CategoryProvider,
    ArticleProvider,
    SyndicationService,
  ],
  exports: [SyndicationService],
})
export class SyndicationModule {}
