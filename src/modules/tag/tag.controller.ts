/**
 * @file Tag controller
 * @module module/tag/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import _trim from 'lodash/trim'
import type { QueryFilter } from 'mongoose'
import { Controller, Get, Put, Post, Delete, Query, Body, UseGuards } from '@nestjs/common'
import { AdminOnlyGuard } from '@app/guards/admin-only.guard'
import { AdminOptionalGuard } from '@app/guards/admin-optional.guard'
import { PermissionPipe } from '@app/pipes/permission.pipe'
import { SuccessResponse } from '@app/decorators/success-response.decorator'
import { RequestContext, IRequestContext } from '@app/decorators/request-context.decorator'
import { PaginateOptions, PaginateResult } from '@app/utils/paginate'
import { TagsDTO, TagPaginateQueryDTO } from './tag.dto'
import { TagService } from './tag.service'
import { Tag } from './tag.model'

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @UseGuards(AdminOptionalGuard)
  @SuccessResponse({ message: 'Get tags succeeded', usePaginate: true })
  getTags(
    @Query(PermissionPipe) query: TagPaginateQueryDTO,
    @RequestContext() { isUnauthenticated }: IRequestContext
  ): Promise<PaginateResult<Tag>> {
    const { sort, page, per_page, ...filters } = query
    const queryFilter: QueryFilter<Tag> = {}
    const paginateOptions: PaginateOptions = { page, perPage: per_page, dateSort: sort }

    // search
    if (filters.keyword) {
      const trimmed = _trim(filters.keyword)
      const keywordRegExp = new RegExp(trimmed, 'i')
      queryFilter.$or = [{ name: keywordRegExp }, { slug: keywordRegExp }, { description: keywordRegExp }]
    }

    // paginate
    return this.tagService.paginate(queryFilter, paginateOptions, isUnauthenticated)
  }

  @Get('all')
  @UseGuards(AdminOptionalGuard)
  @SuccessResponse('Get all tags succeeded')
  getAllTags(@RequestContext() { isAuthenticated }: IRequestContext): Promise<Tag[]> {
    return isAuthenticated
      ? this.tagService.getAllTags({ aggregatePublicOnly: false })
      : this.tagService.getAllTagsCache()
  }

  @Post()
  @UseGuards(AdminOnlyGuard)
  @SuccessResponse('Create tag succeeded')
  createTag(@Body() tag: Tag): Promise<Tag> {
    return this.tagService.create(tag)
  }

  @Delete()
  @UseGuards(AdminOnlyGuard)
  @SuccessResponse('Delete tags succeeded')
  delTags(@Body() body: TagsDTO) {
    return this.tagService.batchDelete(body.tag_ids)
  }

  @Put(':id')
  @UseGuards(AdminOnlyGuard)
  @SuccessResponse('Update Tag succeeded')
  putTag(@RequestContext() { params }: IRequestContext, @Body() tag: Tag): Promise<Tag> {
    return this.tagService.update(params.id, tag)
  }

  @Delete(':id')
  @UseGuards(AdminOnlyGuard)
  @SuccessResponse('Delete tag succeeded')
  delTag(@RequestContext() { params }: IRequestContext) {
    return this.tagService.delete(params.id)
  }
}
