/**
 * @file Tag controller
 * @module module/tag/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import lodash from 'lodash'
import { Controller, Get, Put, Post, Delete, Body, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@app/guards/auth.guard'
import { HumanizedJwtAuthGuard } from '@app/guards/humanized-auth.guard'
import { HttpProcessor } from '@app/decorators/http.decorator'
import { QueryParams } from '@app/decorators/query-params.decorator'
import { PaginateResult } from '@app/utils/paginate'
import { Tag, TagsPayload } from './tag.model'
import { TagService } from './tag.service'

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @UseGuards(HumanizedJwtAuthGuard)
  @HttpProcessor.paginate()
  @HttpProcessor.handle('Get tags')
  getTags(@QueryParams(['cache']) { querys, options, origin, isAuthenticated }): Promise<PaginateResult<Tag>> {
    const keyword = lodash.trim(origin.keyword)
    if (keyword) {
      const keywordRegExp = new RegExp(keyword, 'i')
      querys.$or = [{ name: keywordRegExp }, { slug: keywordRegExp }, { description: keywordRegExp }]
    }

    return !isAuthenticated && querys.cache
      ? this.tagService.getPaginateCache()
      : this.tagService.paginater(querys, options, !isAuthenticated)
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('Create tag')
  createTag(@Body() tag: Tag): Promise<Tag> {
    return this.tagService.create(tag)
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('Delete tags')
  delTags(@Body() body: TagsPayload) {
    return this.tagService.batchDelete(body.tag_ids)
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('Update Tag')
  putTag(@QueryParams() { params }, @Body() tag: Tag): Promise<Tag> {
    return this.tagService.update(params.id, tag)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('Delete tag')
  delTag(@QueryParams() { params }): Promise<Tag> {
    return this.tagService.delete(params.id)
  }
}
