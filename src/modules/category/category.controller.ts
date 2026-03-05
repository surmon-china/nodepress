/**
 * @file Category controller
 * @module module/category/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import type { QueryFilter } from 'mongoose'
import { Controller, Get, Patch, Post, Delete, Query, Body, Param, ParseIntPipe } from '@nestjs/common'
import { RequestContext, IRequestContext } from '@app/decorators/request-context.decorator'
import { OnlyIdentity, IdentityRole } from '@app/decorators/only-identity.decorator'
import { SuccessResponse } from '@app/decorators/success-response.decorator'
import { PaginateOptions, PaginateResult } from '@app/utils/paginate'
import { CategoryIdsDto, CategoryPaginateQueryDto } from './category.dto'
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto'
import { CategoryService } from './category.service'
import { Category } from './category.model'

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @SuccessResponse({ message: 'Get categories succeeded', usePaginate: true })
  getCategories(
    @Query() query: CategoryPaginateQueryDto,
    @RequestContext() { identity }: IRequestContext
  ): Promise<PaginateResult<Category>> {
    const { sort, page, per_page, ...filters } = query
    const queryFilter: QueryFilter<Category> = {}
    const paginateOptions: PaginateOptions = { page, perPage: per_page, dateSort: sort }

    // search
    if (filters.keyword) {
      queryFilter.$or = [
        { name: { $regex: filters.keyword, $options: 'i' } },
        { slug: { $regex: filters.keyword, $options: 'i' } },
        { description: { $regex: filters.keyword, $options: 'i' } }
      ]
    }

    // paginate
    return this.categoryService.paginate(queryFilter, paginateOptions, !identity.isAdmin)
  }

  @Get('all')
  @SuccessResponse('Get all categories succeeded')
  getAllCategories(@RequestContext() { identity }: IRequestContext): Promise<Array<Category>> {
    return identity.isAdmin
      ? this.categoryService.getAllCategories({ aggregatePublicOnly: false })
      : this.categoryService.getAllPublicCategoriesCache()
  }

  @Get(':id')
  @SuccessResponse('Get category succeeded')
  getCategory(@Param('id', ParseIntPipe) id: number): Promise<Category> {
    return this.categoryService.getDetail(id)
  }

  @Post()
  @OnlyIdentity(IdentityRole.Admin)
  @SuccessResponse('Create category succeeded')
  createCategory(@Body() dto: CreateCategoryDto): Promise<Category> {
    return this.categoryService.create(dto)
  }

  @Delete()
  @OnlyIdentity(IdentityRole.Admin)
  @SuccessResponse('Delete categories succeeded')
  deleteCategories(@Body() { category_ids }: CategoryIdsDto) {
    return this.categoryService.batchDelete(category_ids)
  }

  @Patch(':id')
  @OnlyIdentity(IdentityRole.Admin)
  @SuccessResponse('Update category succeeded')
  updateCategory(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCategoryDto): Promise<Category> {
    return this.categoryService.update(id, dto)
  }

  @Delete(':id')
  @OnlyIdentity(IdentityRole.Admin)
  @SuccessResponse('Delete category succeeded')
  deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.delete(id)
  }
}
