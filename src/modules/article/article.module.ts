/**
 * Article module.
 * @file 文章模块
 * @module module/article/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { SitemapModule } from '@app/modules/sitemap/sitemap.module';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { Article } from './article.model';

@Module({
  imports: [TypegooseModule.forFeature(Article), SitemapModule],
  controllers: [ArticleController],
  providers: [ArticleService],
  exports: [ArticleService],
})
export class ArticleModule {}
