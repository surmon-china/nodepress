/**
 * @file Tag dto
 * @module module/tag/dto
 * @author Surmon <https://github.com/surmon-china>
 */

import { IntersectionType } from '@nestjs/mapped-types'
import { IsArray, ArrayNotEmpty, ArrayUnique } from 'class-validator'
import { PaginateOptionDTO } from '@app/models/paginate.model'
import { KeywordQueryDTO } from '@app/models/query.model'

export class TagPaginateQueryDTO extends IntersectionType(PaginateOptionDTO, KeywordQueryDTO) {}

export class TagsDTO {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  tag_ids: string[]
}
