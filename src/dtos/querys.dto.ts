/**
 * @file General query params DTO
 * @module dto/querys
 * @author Surmon <https://github.com/surmon-china>
 */

import { Transform } from 'class-transformer'
import { IsOptional, IsNotEmpty, IsDateString, IsString } from 'class-validator'

// https://www.progress.com/blogs/understanding-iso-8601-date-and-time-format
export class DateQueryDto {
  @IsDateString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  date?: string
}

export class KeywordQueryDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  keyword?: string
}
