/**
 * @file Article controller
 * @module module/article/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import lodash from 'lodash'
import { Types } from 'mongoose'
import { Controller, Get, Put, Post, Patch, Delete, Query, Body, UseGuards, HttpStatus } from '@nestjs/common'
import { QueryParams, QueryParamsResult } from '@app/decorators/queryparams.decorator'
import { Responser } from '@app/decorators/responser.decorator'
import { AdminOnlyGuard } from '@app/guards/admin-only.guard'
import { AdminMaybeGuard } from '@app/guards/admin-maybe.guard'
import { PermissionPipe } from '@app/pipes/permission.pipe'
import { ExposePipe } from '@app/pipes/expose.pipe'
import { SortType } from '@app/constants/biz.constant'
import { TagService } from '@app/modules/tag/tag.service'
import { CategoryService } from '@app/modules/category/category.service'
import { PaginateResult, PaginateQuery, PaginateOptions } from '@app/utils/paginate'
import {
  ArticlePaginateQueryDTO,
  ArticleListQueryDTO,
  ArticleCalendarQueryDTO,
  ArticleIDsDTO,
  ArticlesStateDTO,
} from './article.dto'
import { ARTICLE_HOTTEST_SORT_PARAMS } from './article.model'
import { ArticleService } from './article.service'
import { Article } from './article.model'

@Controller('article')
export class ArticleController {
  constructor(
    private readonly tagService: TagService,
    private readonly categoryService: CategoryService,
    private readonly articleService: ArticleService
  ) {}

  @Get()
  @UseGuards(AdminMaybeGuard)
  @Responser.paginate()
  @Responser.handle('Get articles')
  async getArticles(
    @Query(PermissionPipe, ExposePipe) query: ArticlePaginateQueryDTO
  ): Promise<PaginateResult<Article>> {
    const { page, per_page, sort, ...filters } = query
    const paginateQuery: PaginateQuery<Article> = {}
    const paginateOptions: PaginateOptions = { page, perPage: per_page }

    // sort
    if (!lodash.isUndefined(sort)) {
      if (sort === SortType.Hottest) {
        paginateOptions.sort = ARTICLE_HOTTEST_SORT_PARAMS
      } else {
        paginateOptions.dateSort = sort
      }
    }

    // language
    if (!lodash.isUndefined(filters.lang)) {
      paginateQuery.lang = filters.lang
    }

    // states
    if (!lodash.isUndefined(filters.state)) {
      paginateQuery.state = filters.state
    }
    if (!lodash.isUndefined(filters.public)) {
      paginateQuery.public = filters.public
    }
    if (!lodash.isUndefined(filters.origin)) {
      paginateQuery.origin = filters.origin
    }

    // search
    if (filters.keyword) {
      const trimmed = lodash.trim(filters.keyword)
      const keywordRegExp = new RegExp(trimmed, 'i')
      paginateQuery.$or = [{ title: keywordRegExp }, { content: keywordRegExp }, { description: keywordRegExp }]
    }

    // date
    if (filters.date) {
      const queryDateMS = new Date(filters.date).getTime()
      paginateQuery.create_at = {
        $gte: new Date((queryDateMS / 1000 - 60 * 60 * 8) * 1000),
        $lt: new Date((queryDateMS / 1000 + 60 * 60 * 16) * 1000),
      }
    }

    // tag | category
    if (filters.tag_slug) {
      const tag = await this.tagService.getDetailBySlug(filters.tag_slug)
      paginateQuery.tag = tag._id
    }
    if (filters.category_slug) {
      const category = await this.categoryService.getDetailBySlug(filters.category_slug)
      paginateQuery.category = category._id
    }

    // paginate
    return this.articleService.paginator(paginateQuery, paginateOptions)
  }

  @Get('hottest')
  @Responser.handle('Get hottest articles')
  getHottestArticles(@Query(ExposePipe) query: ArticleListQueryDTO): Promise<Array<Article>> {
    return query.count
      ? this.articleService.getHottestArticles(query.count)
      : this.articleService.getHottestArticlesCache()
  }

  @Get('calendar')
  @UseGuards(AdminMaybeGuard)
  @Responser.handle('Get article calendar')
  getArticleCalendar(
    @Query(ExposePipe) query: ArticleCalendarQueryDTO,
    @QueryParams() { isUnauthenticated }: QueryParamsResult
  ) {
    return this.articleService.getCalendar(isUnauthenticated, query.timezone)
  }

  @Get(':id/context')
  @Responser.handle('Get context articles')
  async getArticleContext(@QueryParams() { params }: QueryParamsResult) {
    const articleID = Number(params.id)
    const article = await this.articleService.getDetailByNumberIDOrSlug({ idOrSlug: articleID, publicOnly: true })
    const [prev_article] = await this.articleService.getNearArticles(articleID, 'early', 1)
    const [next_article] = await this.articleService.getNearArticles(articleID, 'later', 1)
    const related_articles = await this.articleService.getRelatedArticles(article, 20)
    return {
      prev_article: prev_article || null,
      next_article: next_article || null,
      related_articles,
    }
  }

  @Get(':id')
  @UseGuards(AdminMaybeGuard)
  @Responser.handle({
    message: 'Get article detail',
    error: HttpStatus.NOT_FOUND,
  })
  getArticle(@QueryParams() { params, isUnauthenticated }: QueryParamsResult): Promise<Article> {
    // guest user > number ID | slug
    if (isUnauthenticated) {
      const idOrSlug = isNaN(Number(params.id)) ? String(params.id) : Number(params.id)
      return this.articleService.getFullDetailForGuest(idOrSlug)
    }
    // admin user > Object ID | number ID
    return Types.ObjectId.isValid(params.id)
      ? this.articleService.getDetailByObjectID(params.id)
      : this.articleService.getDetailByNumberIDOrSlug({ idOrSlug: Number(params.id) })
  }

  @Post()
  @UseGuards(AdminOnlyGuard)
  @Responser.handle('Create article')
  createArticle(@Body() article: Article): Promise<Article> {
    return this.articleService.create(article)
  }

  @Put(':id')
  @UseGuards(AdminOnlyGuard)
  @Responser.handle('Update article')
  putArticle(@QueryParams() { params }: QueryParamsResult, @Body() article: Article): Promise<Article> {
    return this.articleService.update(params.id, article)
  }

  @Delete(':id')
  @UseGuards(AdminOnlyGuard)
  @Responser.handle('Delete article')
  delArticle(@QueryParams() { params }: QueryParamsResult): Promise<Article> {
    return this.articleService.delete(params.id)
  }

  @Patch()
  @UseGuards(AdminOnlyGuard)
  @Responser.handle('Update articles')
  patchArticles(@Body() body: ArticlesStateDTO) {
    return this.articleService.batchPatchState(body.article_ids, body.state)
  }

  @Delete()
  @UseGuards(AdminOnlyGuard)
  @Responser.handle('Delete articles')
  delArticles(@Body() body: ArticleIDsDTO) {
    return this.articleService.batchDelete(body.article_ids)
  }
}
