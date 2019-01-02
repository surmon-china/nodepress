/**
 * Tag controller.
 * @file 标签模块控制器
 * @module module/tag/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import { PaginateResult } from 'mongoose';
import { Controller, Get, Put, Post, Delete, Body, UseGuards } from '@nestjs/common';
import { HumanizedJwtAuthGuard } from '@app/guards/humanized-auth.guard';
import { HttpProcessor } from '@app/decorators/http.decorator';
import { QueryParams } from '@app/decorators/query-params.decorator';
import { JwtAuthGuard } from '@app/guards/auth.guard';
import { Tag, DelTags } from './tag.model';
import { TagService } from './tag.service';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @UseGuards(HumanizedJwtAuthGuard)
  @HttpProcessor.paginate()
  @HttpProcessor.handle('获取标签')
  getTags(@QueryParams() { querys, options, origin, isAuthenticated }): Promise<PaginateResult<Tag>> {
    if (origin.keyword) {
      const keywordRegExp = new RegExp(origin.keyword);
      querys.$or = [
        { name: keywordRegExp },
        { slug: keywordRegExp },
        { description: keywordRegExp },
      ];
    }
    return isAuthenticated
      ? this.tagService.getList(querys, options, isAuthenticated)
      : this.tagService.getListCache();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('添加标签')
  createTag(@Body() tag: Tag): Promise<Tag> {
    return this.tagService.createItem(tag);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('批量删除标签')
  delTags(@Body() body: DelTags): Promise<any> {
    return this.tagService.deleteList(body.tags);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('修改标签')
  putTag(@QueryParams() { params }, @Body() tag: Tag): Promise<Tag> {
    return this.tagService.putItem(params.id, tag);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('删除单个标签')
  delTag(@QueryParams() { params }): Promise<any> {
    return this.tagService.deleteItem(params.id);
  }
}
