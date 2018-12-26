/**
 * Category controller.
 * @file 分类模块控制器
 * @module modules/category/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import { PaginateResult } from 'mongoose';
import { Controller, Get, Put, Post, Delete, Body, UseGuards } from '@nestjs/common';
import { HumanizedJwtAuthGuard } from '@app/guards/humanized-auth.guard';
import { HttpProcessor } from '@app/decorators/http.decorator';
import { QueryParams } from '@app/decorators/query-params.decorator';
import { JwtAuthGuard } from '@app/guards/auth.guard';
import { Category, DelCategorys } from './category.model';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @UseGuards(HumanizedJwtAuthGuard)
  @HttpProcessor.paginate()
  @HttpProcessor.handle('获取分类')
  getCategorys(@QueryParams() { querys, options, origin, isAuthenticated }): Promise<PaginateResult<Category>> {
    if (origin.keyword) {
      const keywordRegExp = new RegExp(origin.keyword);
      querys.$or = [
        { name: keywordRegExp },
        { slug: keywordRegExp },
        { description: keywordRegExp },
      ];
    }
    return isAuthenticated
      ? this.categoryService.getList(querys, options, isAuthenticated)
      : this.categoryService.getListCache();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('添加分类')
  createCategory(@Body() category: Category): Promise<Category> {
    return this.categoryService.createItem(category);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('批量删除分类')
  delCategorys(@Body() body: DelCategorys): Promise<any> {
    return this.categoryService.deleteList(body.categorys);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('修改分类')
  putCategory(@QueryParams() { params }, @Body() category: Category): Promise<Category> {
    return this.categoryService.putItem(params.id, category);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('删除单个分类')
  delCategory(@QueryParams() { params }): Promise<any> {
    return this.categoryService.deleteItem(params.id);
  }
}