/**
 * @file General query params DTO
 * @module dto/queries
 * @author Surmon <https://github.com/surmon-china>
 */

import _escapeRegExp from 'lodash/escapeRegExp'
import { Transform } from 'class-transformer'
import { IsDateString, IsString, IsOptional, IsNotEmpty, MaxLength } from 'class-validator'
import { NormalizeString } from '@app/decorators/normalize-string.decorator'

// https://www.progress.com/blogs/understanding-iso-8601-date-and-time-format
export class DateQueryDto {
  @IsDateString()
  @IsOptional()
  @NormalizeString({ trim: true })
  date?: string
}

export class KeywordQueryDto {
  @MaxLength(50)
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @NormalizeString({ trim: true, collapseSpaces: true })
  @Transform(({ value }) => (typeof value === 'string' ? _escapeRegExp(value) : value))
  keyword?: string
}
