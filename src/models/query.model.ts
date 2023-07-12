/**
 * @file Query params model
 * @module model/query
 * @author Surmon <https://github.com/surmon-china>
 */

import { IsIn, IsInt, IsOptional, IsNotEmpty, IsDateString, IsString } from 'class-validator'
import { Transform } from 'class-transformer'
import { unknownToNumber } from '@app/transformers/value.transformer'

export const enum BooleanNumberValue {
  False = 0, // Number(false)
  True = 1 // Number(true)
}

// https://www.progress.com/blogs/understanding-iso-8601-date-and-time-format
export class DateQueryDTO {
  @IsDateString()
  @IsNotEmpty()
  @IsOptional()
  date?: string
}

export class KeywordQueryDTO {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  keyword?: string
}

// MARK: example
export class BooleanQueryDTO {
  @IsIn([BooleanNumberValue.True, BooleanNumberValue.False])
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => unknownToNumber(value))
  boolean?: BooleanNumberValue.True | BooleanNumberValue.False
}
