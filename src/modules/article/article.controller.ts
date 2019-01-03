/**
 * Article controller.
 * @file 文章模块控制器
 * @module module/article/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import { PaginateResult } from 'mongoose';
import { Controller, Get, Put, Post, Delete, Body, UseGuards } from '@nestjs/common';
import { HumanizedJwtAuthGuard } from '@app/guards/humanized-auth.guard';
import { HttpProcessor } from '@app/decorators/http.decorator';
import { QueryParams, EQueryParamsFields as EQPFields } from '@app/decorators/query-params.decorator';
import { JwtAuthGuard } from '@app/guards/auth.guard';
import { TagService } from '@app/modules/tag/tag.service';
import { CategoryService } from '@app/modules/category/category.service';
import { Article, DelArticles } from './article.model';
import { ArticleService } from './article.service';
import { ESortType } from '@app/interfaces/state.interface';

@Controller('article')
export class ArticleController {
  constructor(
    private readonly tagService: TagService,
    private readonly categoryService: CategoryService,
    private readonly articleService: ArticleService,
  ) {}

  @Get()
  @UseGuards(HumanizedJwtAuthGuard)
  @HttpProcessor.paginate()
  @HttpProcessor.handle('获取文章')
  getArticles(@QueryParams(
    EQPFields.Date, EQPFields.State, EQPFields.Public, EQPFields.Origin, EQPFields.Sort, EQPFields.Keyword,
    'cache', 'tag', 'category', 'tag_slug', 'category_slug',
  ) queryParams): Promise<PaginateResult<Article>> {
    const { querys, options, origin, isAuthenticated } = queryParams;
    // 如果是前台请求缓存文章，则忽略一切后续处理
    if (querys.cache && !isAuthenticated && querys.sort === ESortType.Hot) {
      return this.articleService.getHotListCache();
    }
    // 关键词搜索
    if (querys.keyword) {
      const keywordRegExp = new RegExp(querys.keyword);
      delete querys.keyword;
      querys.$or = [
        { title: keywordRegExp },
        { content: keywordRegExp },
        { description: keywordRegExp },
      ];
    }
    // 分类别名查询
    type TSlugService =  (slug: string) => Promise<any>;
    const matchedParams = [
      { field: 'tag_slug', name: 'tag', service: this.tagService.getItemBySlug as TSlugService},
      { field: 'category_slug', name: 'category', service: this.categoryService.getItemBySlug as TSlugService},
    ].find(item => querys[item.field]);
    return !matchedParams
      ? this.articleService.getList(querys, options)
      : matchedParams.service(origin[matchedParams.field]).then(paramItem => {
          if (paramItem) {
            querys[matchedParams.name] = paramItem._id;
            return this.articleService.getList(querys, options);
          } else {
            return Promise.reject(`标签 ${origin.tag_slug}不存在`);
          }
        });
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('添加文章')
  createArticle(@Body() article: Article): Promise<Article> {
    return this.articleService.createItem(article);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('批量删除文章')
  delArticles(@Body() body: DelArticles): Promise<any> {
    return this.articleService.deleteList(body.articles);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('修改文章')
  putArticle(@QueryParams() { params }, @Body() article: Article): Promise<Article> {
    return this.articleService.putItem(params.id, article);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('删除单个文章')
  delArticle(@QueryParams() { params }): Promise<any> {
    return this.articleService.deleteItem(params.id);
  }
}
