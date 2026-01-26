/**
 * @file General extend model
 * @module model/extend
 * @author Surmon <https://github.com/surmon-china>
 */

import { IsIn, IsInt, IsOptional, IsNotEmpty, Min, Max } from 'class-validator'
import { Transform } from 'class-transformer'
import { SortMode } from '@app/constants/biz.constant'
import { unknownToNumber } from '@app/transformers/value.transformer'

export class PaginateBaseOptionDTO {
  @Min(1)
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => unknownToNumber(value))
  page?: number

  @Min(1)
  @Max(50)
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => unknownToNumber(value))
  per_page?: number
}

export class PaginateOptionDTO extends PaginateBaseOptionDTO {
  @IsIn([SortMode.Oldest, SortMode.Latest])
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => unknownToNumber(value))
  sort?: SortMode.Oldest | SortMode.Latest
}

export class PaginateOptionWithHotSortDTO extends PaginateBaseOptionDTO {
  @IsIn([SortMode.Oldest, SortMode.Latest, SortMode.Hottest])
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => unknownToNumber(value))
  sort?: SortMode
}
