/**
 * @file Category controller
 * @module module/category/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import { Controller, UseGuards, Get, Put, Post, Delete, Body, Param } from '@nestjs/common'
import { JwtAuthGuard } from '@app/guards/auth.guard'
import { HumanizedJwtAuthGuard } from '@app/guards/humanized-auth.guard'
import { HttpProcessor } from '@app/decorators/http.decorator'
import { QueryParams } from '@app/decorators/query-params.decorator'
import { PaginateResult } from '@app/utils/paginate'
import { Category, CategoriesPayload } from './category.model'
import { CategoryService } from './category.service'

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @UseGuards(HumanizedJwtAuthGuard)
  @HttpProcessor.paginate()
  @HttpProcessor.handle('Get categories')
  getCategories(@QueryParams() { querys, options, isAuthenticated }): Promise<PaginateResult<Category>> {
    return this.categoryService.paginater(querys, options, !isAuthenticated)
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('Create category')
  createCategory(@Body() category: Category): Promise<Category> {
    return this.categoryService.create(category)
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('Delete categories')
  delCategories(@Body() body: CategoriesPayload) {
    return this.categoryService.batchDelete(body.category_ids)
  }

  @Get(':id')
  @HttpProcessor.handle('Get categories tree')
  getCategory(@Param('id') categoryID): Promise<Category[]> {
    return this.categoryService.getGenealogyById(categoryID)
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('Update category')
  putCategory(@QueryParams() { params }, @Body() category: Category): Promise<Category> {
    return this.categoryService.update(params.id, category)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('Delete category')
  delCategory(@QueryParams() { params }) {
    return this.categoryService.delete(params.id)
  }
}
