/**
 * @file Tag controller
 * @module module/tag/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import lodash from 'lodash'
import { Controller, Get, Put, Post, Delete, Query, Body, UseGuards } from '@nestjs/common'
import { AdminOnlyGuard } from '@app/guards/admin-only.guard'
import { AdminMaybeGuard } from '@app/guards/admin-maybe.guard'
import { PermissionPipe } from '@app/pipes/permission.pipe'
import { ExposePipe } from '@app/pipes/expose.pipe'
import { Responsor } from '@app/decorators/responsor.decorator'
import { QueryParams, QueryParamsResult } from '@app/decorators/queryparams.decorator'
import { PaginateResult, PaginateQuery, PaginateOptions } from '@app/utils/paginate'
import { TagsDTO, TagPaginateQueryDTO } from './tag.dto'
import { TagService } from './tag.service'
import { Tag } from './tag.model'

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @UseGuards(AdminMaybeGuard)
  @Responsor.paginate()
  @Responsor.handle('Get tags')
  getTags(
    @Query(PermissionPipe, ExposePipe) query: TagPaginateQueryDTO,
    @QueryParams() { isUnauthenticated }: QueryParamsResult
  ): Promise<PaginateResult<Tag>> {
    const { sort, page, per_page, ...filters } = query
    const paginateQuery: PaginateQuery<Tag> = {}
    const paginateOptions: PaginateOptions = { page, perPage: per_page, dateSort: sort }

    // search
    if (filters.keyword) {
      const trimmed = lodash.trim(filters.keyword)
      const keywordRegExp = new RegExp(trimmed, 'i')
      paginateQuery.$or = [{ name: keywordRegExp }, { slug: keywordRegExp }, { description: keywordRegExp }]
    }

    // paginater
    return this.tagService.paginater(paginateQuery, paginateOptions, isUnauthenticated)
  }

  @Get('all')
  @Responsor.handle('Get all tags')
  getAllTags(): Promise<Array<Tag>> {
    return this.tagService.getAllTagsCache()
  }

  @Post()
  @UseGuards(AdminOnlyGuard)
  @Responsor.handle('Create tag')
  createTag(@Body() tag: Tag): Promise<Tag> {
    return this.tagService.create(tag)
  }

  @Delete()
  @UseGuards(AdminOnlyGuard)
  @Responsor.handle('Delete tags')
  delTags(@Body() body: TagsDTO) {
    return this.tagService.batchDelete(body.tag_ids)
  }

  @Put(':id')
  @UseGuards(AdminOnlyGuard)
  @Responsor.handle('Update Tag')
  putTag(@QueryParams() { params }: QueryParamsResult, @Body() tag: Tag): Promise<Tag> {
    return this.tagService.update(params.id, tag)
  }

  @Delete(':id')
  @UseGuards(AdminOnlyGuard)
  @Responsor.handle('Delete tag')
  delTag(@QueryParams() { params }: QueryParamsResult): Promise<Tag> {
    return this.tagService.delete(params.id)
  }
}
