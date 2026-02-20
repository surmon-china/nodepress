/**
 * @file General paginate DTO
 * @module dto/paginate
 * @author Surmon <https://github.com/surmon-china>
 */

import { Transform } from 'class-transformer'
import { IsIn, IsInt, IsOptional, Min, Max } from 'class-validator'
import { unknownToNumber } from '@app/transformers/value.transformer'
import { SortMode } from '@app/constants/sort.constant'
import { APP_BIZ } from '@app/app.config'

export class PaginateBaseOptionDto {
  @Min(1)
  @IsInt()
  @IsOptional()
  @Transform(({ value }) => unknownToNumber(value))
  page?: number

  @Min(1)
  @Max(APP_BIZ.PAGINATION_MAX_SIZE)
  @IsInt()
  @IsOptional()
  @Transform(({ value }) => unknownToNumber(value))
  per_page?: number
}

export class PaginateOptionDto extends PaginateBaseOptionDto {
  @IsIn([SortMode.Oldest, SortMode.Latest])
  @IsInt()
  @IsOptional()
  @Transform(({ value }) => unknownToNumber(value))
  sort?: SortMode.Oldest | SortMode.Latest
}

export class PaginateOptionWithHotSortDto extends PaginateBaseOptionDto {
  @IsIn([SortMode.Oldest, SortMode.Latest, SortMode.Hottest])
  @IsInt()
  @IsOptional()
  @Transform(({ value }) => unknownToNumber(value))
  sort?: SortMode
}
