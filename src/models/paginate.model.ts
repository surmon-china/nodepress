/**
 * @file General extend model
 * @module model/extend
 * @author Surmon <https://github.com/surmon-china>
 */

import { IsIn, IsInt, IsOptional, IsNotEmpty, Min, Max } from 'class-validator'
import { Transform } from 'class-transformer'
import { SortType } from '@app/interfaces/biz.interface'
import { unknowToNumber } from '@app/transformers/value.transformer'

export class PaginateBaseOptionDTO {
  @Min(1)
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => unknowToNumber(value))
  page?: number

  @Min(1)
  @Max(50)
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => unknowToNumber(value))
  per_page?: number
}

export class PaginateOptionDTO extends PaginateBaseOptionDTO {
  @IsIn([SortType.Asc, SortType.Desc])
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => unknowToNumber(value))
  sort?: SortType.Asc | SortType.Desc
}

export class PaginateOptionWithHotSortDTO extends PaginateBaseOptionDTO {
  @IsIn([SortType.Asc, SortType.Desc, SortType.Hottest])
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => unknowToNumber(value))
  sort?: SortType
}
