/**
 * @file Tag dto
 * @module module/tag/dto
 * @author Surmon <https://github.com/surmon-china>
 */

import { IntersectionType, PickType, PartialType } from '@nestjs/mapped-types'
import { IsInt, IsArray, ArrayNotEmpty, ArrayUnique } from 'class-validator'
import { PaginateOptionDto } from '@app/dtos/paginate.dto'
import { KeywordQueryDto } from '@app/dtos/querys.dto'
import { Tag } from './tag.model'

export class CreateTagDto extends PickType(Tag, ['name', 'slug', 'description', 'extras'] as const) {}

export class UpdateTagDto extends PartialType(CreateTagDto) {}

export class TagPaginateQueryDto extends IntersectionType(PaginateOptionDto, KeywordQueryDto) {}

export class TagIdsDto {
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsArray()
  @IsInt({ each: true })
  tag_ids: number[]
}
