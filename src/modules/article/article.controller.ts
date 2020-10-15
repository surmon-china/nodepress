/**
 * Article controller.
 * @file 文章模块控制器
 * @module module/article/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import lodash from 'lodash';
import { PaginateResult } from 'mongoose';
import { Controller, Get, Put, Post, Patch, Delete, Body, UseGuards, HttpStatus } from '@nestjs/common';
import { QueryParams, EQueryParamsField as QueryField } from '@app/decorators/query-params.decorator';
import { HttpProcessor } from '@app/decorators/http.decorator';
import { JwtAuthGuard } from '@app/guards/auth.guard';
import { HumanizedJwtAuthGuard } from '@app/guards/humanized-auth.guard';
import { ESortType } from '@app/interfaces/state.interface';
import { TagService } from '@app/modules/tag/tag.service';
import { CategoryService } from '@app/modules/category/category.service';
import { Article, DelArticles, PatchArticles } from './article.model';
import { ArticleService } from './article.service';

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
    QueryField.Date, QueryField.State, QueryField.Public, QueryField.Origin,
    'cache', 'tag', 'category', 'tag_slug', 'category_slug',
  ]) { querys, options, origin, isAuthenticated }): Promise<PaginateResult<Article>> {

    // 如果是请求热门文章，则判断如何处理（注：前后台都会请求热门文章）
    if (Number(origin.sort) === ESortType.Hot) {
      // 设置热排参数
      options.sort = this.articleService.getHotSortOption();

      // 前台缓存请求，则忽略一切后续处理
      if (!isAuthenticated && querys.cache) {
        return this.articleService.getUserHotListCache();
      }
    }

    // 关键词搜索
    const keyword = lodash.trim(origin.keyword);
    if (keyword) {
      const keywordRegExp = new RegExp(keyword, 'i');
      querys.$or = [
        { title: keywordRegExp },
        { content: keywordRegExp },
        { description: keywordRegExp },
      ];
    }

    // 分类别名查询
    type TSlugService = (slug: string) => Promise<any>;
    const slugParams = [
      {
        name: 'tag',
        field: 'tag_slug',
        service: this.tagService.getDetailBySlug.bind(this.tagService) as TSlugService,
      },
      {
        name: 'category',
        field: 'category_slug',
        service: this.categoryService.getDetailBySlug.bind(this.categoryService) as TSlugService,
      },
    ];

    const matchedParam = slugParams.find(item => querys[item.field]);
    const matchedField = matchedParam?.field;
    const matchedSlug = matchedField && querys[matchedField];
    return !matchedSlug
      ? this.articleService.getList(querys, options)
      : matchedParam.service(matchedSlug).then(param => {
          const paramField = matchedParam.name;
          const paramId = param?._id;
          if (paramId) {
            querys = Object.assign(querys, { [paramField]: paramId });
            Reflect.deleteProperty(querys, matchedField);
            return this.articleService.getList(querys, options);
          } else {
            return Promise.reject(`条件 ${matchedField} -> ${matchedSlug} 不存在`);
          }
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
  patchArticles(@Body() body: PatchArticles) {
    return this.articleService.batchPatchState(body.article_ids, body.state);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('批量删除文章')
  delArticles(@Body() body: DelArticles) {
    return this.articleService.batchDelete(body.article_ids);
  }

  @Get(':id')
  @UseGuards(HumanizedJwtAuthGuard)
  @HttpProcessor.handle({ message: '获取文章详情', error: HttpStatus.NOT_FOUND })
  getArticle(@QueryParams() { params, isAuthenticated }): Promise<Article> {
    const isObjectId = isNaN(Number(params.id));
    return isAuthenticated && isObjectId
      ? this.articleService.getDetailByObjectId(params.id)
      : this.articleService.getFullDetailForUser(params.id);
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
