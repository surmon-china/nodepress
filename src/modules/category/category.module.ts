/**
 * Category module.
 * @file 分类模块
 * @module modules/category/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { SitemapModule } from '@app/modules/sitemap/sitemap.module';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { Category } from './category.model';

@Module({
  imports: [TypegooseModule.forFeature(Category), SitemapModule],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
