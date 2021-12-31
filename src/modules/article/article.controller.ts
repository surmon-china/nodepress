/**
 * @file Article controller
 * @module module/article/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import lodash from 'lodash'
import { isValidObjectId } from 'mongoose'
import { Controller, Get, Put, Post, Patch, Delete, Body, UseGuards, HttpStatus } from '@nestjs/common'
import { QueryParams, QueryParamsField as QueryField } from '@app/decorators/query-params.decorator'
import { HttpProcessor } from '@app/decorators/http.decorator'
import { JwtAuthGuard } from '@app/guards/auth.guard'
import { HumanizedJwtAuthGuard } from '@app/guards/humanized-auth.guard'
import { SortType } from '@app/interfaces/biz.interface'
import { TagService } from '@app/modules/tag/tag.service'
import { CategoryService } from '@app/modules/category/category.service'
import { PaginateResult } from '@app/utils/paginate'
import { Article, ArticlesPayload, ArticlesStatePayload } from './article.model'
import { ArticleService, COMMON_HOT_SORT_PARAMS } from './article.service'

@Controller('article')
export class ArticleController {
  constructor(
    private readonly tagService: TagService,
    private readonly categoryService: CategoryService,
    private readonly articleService: ArticleService
  ) {}

  @Get()
  @UseGuards(HumanizedJwtAuthGuard)
  @HttpProcessor.paginate()
  @HttpProcessor.handle('Get articles')
  getArticles(
    @QueryParams([
      QueryField.Date,
      QueryField.State,
      QueryField.Public,
      QueryField.Origin,
      'cache',
      'tag',
      'category',
      'tag_slug',
      'category_slug',
    ])
    { querys, options, origin, isAuthenticated }
  ): Promise<PaginateResult<Article>> {
    // 如果是请求热门文章，则判断如何处理（注：前后台都会请求热门文章）
    if (Number(origin.sort) === SortType.Hot) {
      // 设置热排参数
      options.sort = COMMON_HOT_SORT_PARAMS
      // request cache from user
      if (!isAuthenticated && querys.cache) {
        return this.articleService.getUserHotListCache()
      }
    }

    // 关键词搜索
    const keyword = lodash.trim(origin.keyword)
    if (keyword) {
      const keywordRegExp = new RegExp(keyword, 'i')
      querys.$or = [{ title: keywordRegExp }, { content: keywordRegExp }, { description: keywordRegExp }]
    }

    // 分类别名查询
    type TSlugService = (slug: string) => Promise<any>
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
    ]

    const matchedParam = slugParams.find((item) => querys[item.field])
    const matchedField = matchedParam?.field
    const matchedSlug = matchedField && querys[matchedField]
    return !matchedSlug
      ? this.articleService.paginater(querys, options)
      : matchedParam.service(matchedSlug).then((param) => {
          const paramField = matchedParam.name
          const paramId = param?._id
          if (paramId) {
            querys = Object.assign(querys, { [paramField]: paramId })
            Reflect.deleteProperty(querys, matchedField)
            return this.articleService.paginater(querys, options)
          } else {
            return Promise.reject(`条件 ${matchedField} > ${matchedSlug} 不存在`)
          }
        })
  }

  @Get(':id')
  @UseGuards(HumanizedJwtAuthGuard)
  @HttpProcessor.handle({
    message: 'Get article detail',
    error: HttpStatus.NOT_FOUND,
  })
  getArticle(@QueryParams() { params, isAuthenticated }): Promise<Article> {
    return isAuthenticated && isValidObjectId(params.id)
      ? this.articleService.getDetailByObjectID(params.id)
      : this.articleService.getFullDetailForUser(isNaN(params.id) ? String(params.id) : Number(params.id))
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('Create article')
  createArticle(@Body() article: Article): Promise<Article> {
    return this.articleService.create(article)
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('Update article')
  putArticle(@QueryParams() { params }, @Body() article: Article): Promise<Article> {
    return this.articleService.update(params.id, article)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('Delete article')
  delArticle(@QueryParams() { params }): Promise<Article> {
    return this.articleService.delete(params.id)
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('Update articles')
  patchArticles(@Body() body: ArticlesStatePayload) {
    return this.articleService.batchPatchState(body.article_ids, body.state)
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('Delete articles')
  delArticles(@Body() body: ArticlesPayload) {
    return this.articleService.batchDelete(body.article_ids)
  }
}
