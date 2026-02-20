/**
 * @file Category dto
 * @module module/category/dto
 * @author Surmon <https://github.com/surmon-china>
 */

import { IntersectionType, PickType, PartialType } from '@nestjs/mapped-types'
import { IsInt, IsArray, ArrayNotEmpty, ArrayUnique } from 'class-validator'
import { PaginateOptionDto } from '@app/dtos/paginate.dto'
import { KeywordQueryDto } from '@app/dtos/querys.dto'
import { Category } from './category.model'

export class CreateCategoryDto extends PickType(Category, [
  'parent_id',
  'name',
  'slug',
  'description',
  'extras'
] as const) {}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}

export class CategoryPaginateQueryDto extends IntersectionType(PaginateOptionDto, KeywordQueryDto) {}

export class CategoryIdsDto {
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsArray()
  @IsInt({ each: true })
  category_ids: number[]
}
