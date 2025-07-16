/**
 * @file Category controller
 * @module module/category/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import { Controller, UseGuards, Get, Put, Post, Delete, Query, Body } from '@nestjs/common'
import { AdminOnlyGuard } from '@app/guards/admin-only.guard'
import { AdminOptionalGuard } from '@app/guards/admin-optional.guard'
import { PermissionPipe } from '@app/pipes/permission.pipe'
import { RequestContext, IRequestContext } from '@app/decorators/request-context.decorator'
import { SuccessResponse } from '@app/decorators/success-response.decorator'
import { PaginateResult } from '@app/utils/paginate'
import { CategoriesDTO, CategoryPaginateQueryDTO } from './category.dto'
import { CategoryService } from './category.service'
import { Category } from './category.model'

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @UseGuards(AdminOptionalGuard)
  @SuccessResponse({ message: 'Get categories succeeded', usePaginate: true })
  getCategories(
    @Query(PermissionPipe) query: CategoryPaginateQueryDTO,
    @RequestContext() { isUnauthenticated }: IRequestContext
  ): Promise<PaginateResult<Category>> {
    return this.categoryService.paginate(
      {},
      { page: query.page, perPage: query.per_page, dateSort: query.sort },
      isUnauthenticated
    )
  }

  @Get('all')
  @UseGuards(AdminOptionalGuard)
  @SuccessResponse('Get all categories succeeded')
  getAllCategories(@RequestContext() { isAuthenticated }: IRequestContext): Promise<Array<Category>> {
    return isAuthenticated
      ? this.categoryService.getAllCategories({ aggregatePublicOnly: false })
      : this.categoryService.getAllCategoriesCache()
  }

  @Post()
  @UseGuards(AdminOnlyGuard)
  @SuccessResponse('Create category succeeded')
  createCategory(@Body() category: Category): Promise<Category> {
    return this.categoryService.create(category)
  }

  @Delete()
  @UseGuards(AdminOnlyGuard)
  @SuccessResponse('Delete categories succeeded')
  delCategories(@Body() body: CategoriesDTO) {
    return this.categoryService.batchDelete(body.category_ids)
  }

  @Get(':id')
  @SuccessResponse('Get categories tree succeeded')
  getCategory(@RequestContext() { params }: IRequestContext): Promise<Category[]> {
    return this.categoryService.getGenealogyById(params.id)
  }

  @Put(':id')
  @UseGuards(AdminOnlyGuard)
  @SuccessResponse('Update category succeeded')
  putCategory(@RequestContext() { params }: IRequestContext, @Body() category: Category): Promise<Category> {
    return this.categoryService.update(params.id, category)
  }

  @Delete(':id')
  @UseGuards(AdminOnlyGuard)
  @SuccessResponse('Delete category succeeded')
  delCategory(@RequestContext() { params }: IRequestContext) {
    return this.categoryService.delete(params.id)
  }
}
