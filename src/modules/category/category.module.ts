/**
 * @file Category module
 * @module module/category/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { Module, forwardRef } from '@nestjs/common'
import { ArticleModule } from '@app/modules/article/article.module'
import { CategoryController } from './category.controller'
import { CategoryProvider } from './category.model'
import { CategoryService } from './category.service'
import { CategoryListener } from './category.listener'

@Module({
  imports: [forwardRef(() => ArticleModule)],
  controllers: [CategoryController],
  providers: [CategoryProvider, CategoryService, CategoryListener],
  exports: [CategoryService]
})
export class CategoryModule {}
