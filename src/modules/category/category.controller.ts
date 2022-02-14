/**
 * @file Category controller
 * @module module/category/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import { Controller, UseGuards, Get, Put, Post, Delete, Query, Body } from '@nestjs/common'
import { AdminOnlyGuard } from '@app/guards/admin-only.guard'
import { AdminMaybeGuard } from '@app/guards/admin-maybe.guard'
import { PermissionPipe } from '@app/pipes/permission.pipe'
import { ExposePipe } from '@app/pipes/expose.pipe'
import { QueryParams, QueryParamsResult } from '@app/decorators/queryparams.decorator'
import { Responsor } from '@app/decorators/responsor.decorator'
import { PaginateResult } from '@app/utils/paginate'
import { CategoriesDTO, CategoryPaginateQueryDTO } from './category.dto'
import { CategoryService } from './category.service'
import { Category } from './category.model'

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @UseGuards(AdminMaybeGuard)
  @Responsor.paginate()
  @Responsor.handle('Get categories')
  getCategories(
    @Query(PermissionPipe, ExposePipe) query: CategoryPaginateQueryDTO,
    @QueryParams() { isUnauthenticated }: QueryParamsResult
  ): Promise<PaginateResult<Category>> {
    return this.categoryService.paginater(
      {},
      { page: query.page, perPage: query.per_page, dateSort: query.sort },
      isUnauthenticated
    )
  }

  @Post()
  @UseGuards(AdminOnlyGuard)
  @Responsor.handle('Create category')
  createCategory(@Body() category: Category): Promise<Category> {
    return this.categoryService.create(category)
  }

  @Delete()
  @UseGuards(AdminOnlyGuard)
  @Responsor.handle('Delete categories')
  delCategories(@Body() body: CategoriesDTO) {
    return this.categoryService.batchDelete(body.category_ids)
  }

  @Get(':id')
  @Responsor.handle('Get categories tree')
  getCategory(@QueryParams() { params }: QueryParamsResult): Promise<Category[]> {
    return this.categoryService.getGenealogyById(params.id)
  }

  @Put(':id')
  @UseGuards(AdminOnlyGuard)
  @Responsor.handle('Update category')
  putCategory(@QueryParams() { params }: QueryParamsResult, @Body() category: Category): Promise<Category> {
    return this.categoryService.update(params.id, category)
  }

  @Delete(':id')
  @UseGuards(AdminOnlyGuard)
  @Responsor.handle('Delete category')
  delCategory(@QueryParams() { params }: QueryParamsResult) {
    return this.categoryService.delete(params.id)
  }
}
