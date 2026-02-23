/**
 * @file General query params DTO
 * @module dto/querys
 * @author Surmon <https://github.com/surmon-china>
 */

import { IsOptional, IsNotEmpty, IsDateString, IsString } from 'class-validator'
import { NormalizeString } from '@app/decorators/normalize-string.decorator'

// https://www.progress.com/blogs/understanding-iso-8601-date-and-time-format
export class DateQueryDto {
  @IsDateString()
  @IsOptional()
  @NormalizeString({ trim: true })
  date?: string
}

export class KeywordQueryDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @NormalizeString({ trim: true })
  keyword?: string
}
