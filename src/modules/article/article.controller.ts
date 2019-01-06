/**
 * Article controller.
 * @file 文章模块控制器
 * @module module/article/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import { PaginateResult } from 'mongoose';
import { Controller, Get, Put, Post, Patch, Delete, Body, UseGuards } from '@nestjs/common';
import { HumanizedJwtAuthGuard } from '@app/guards/humanized-auth.guard';
import { HttpProcessor } from '@app/decorators/http.decorator';
import { QueryParams, EQueryParamsField as QueryField } from '@app/decorators/query-params.decorator';
import { JwtAuthGuard } from '@app/guards/auth.guard';
import { TagService } from '@app/modules/tag/tag.service';
import { CategoryService } from '@app/modules/category/category.service';
import { Article, DelArticles, PatchArticles } from './article.model';
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
  getArticles(@QueryParams([
    QueryField.Date, QueryField.State, QueryField.Public, QueryField.Origin, 'cache', 'tag', 'category', 'tag_slug', 'category_slug',
  ]) { querys, options, origin, isAuthenticated }): Promise<PaginateResult<Article>> {

    // 如果是前台请求热门缓存文章，则忽略一切后续处理（前后台都会请求热门文章）
    if (querys.cache && !isAuthenticated && querys.sort === ESortType.Hot) {
      return this.articleService.getHotListCache();
    }

    // 关键词搜索
    if (origin.keyword) {
      const keywordRegExp = new RegExp(origin.keyword);
      querys.$or = [
        { title: keywordRegExp },
        { content: keywordRegExp },
        { description: keywordRegExp },
      ];
    }

    // 分类别名查询
    type TSlugService = (slug: string) => Promise<any>;
    const slugParams = [
      { field: 'tag_slug', name: 'tag', service: this.tagService.getDetailBySlug as TSlugService},
      { field: 'category_slug', name: 'category', service: this.categoryService.getDetailBySlug as TSlugService},
    ];

    const matchedParam = slugParams.find(item => querys[item.field]);
    const matchedSlug = matchedParam && querys[matchedParam.field];
    return !matchedParam
      ? this.articleService.getList(querys, options)
      : matchedParam.service(matchedSlug).then(param => {
        return param && param._id
          ? this.articleService.getList(Object.assign(querys, { [matchedParam.name]: param._id }), options)
          : Promise.reject(`标签 ${querys.tag_slug}不存在`);
        });
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('添加文章')
  createArticle(@Body() article: Article): Promise<Article> {
    return this.articleService.create(article);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('批量更新文章')
  patchArticles(@Body() body: PatchArticles): Promise<any> {
    return this.articleService.batchPatchState(body.articles, body.state);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('批量删除文章')
  delArticles(@Body() body: DelArticles): Promise<any> {
    return this.articleService.batchDelete(body.articles);
  }

  @Get(':id')
  @UseGuards(HumanizedJwtAuthGuard)
  @HttpProcessor.handle('获取文章详情')
  getArticle(@QueryParams() { params, isAuthenticated }): Promise<Article> {
    return isAuthenticated
      ? this.articleService.getDetailForAdmin(params.id)
      : this.articleService.getDetailForUser(params.id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('修改文章')
  putArticle(@QueryParams() { params }, @Body() article: Article): Promise<Article> {
    return this.articleService.update(params.id, article);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('删除单个文章')
  delArticle(@QueryParams() { params }): Promise<Article> {
    return this.articleService.delete(params.id);
  }
}
