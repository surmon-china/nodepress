/**
 * @file General author DTO
 * @module dto/author
 * @author Surmon <https://github.com/surmon-china>
 */

import { IsString, IsEmail, MaxLength, IsOptional } from 'class-validator'
import { NormalizeString } from '@app/decorators/normalize-string.decorator'

export class OptionalAuthorDto {
  @MaxLength(100)
  @IsString()
  @IsOptional()
  @NormalizeString({ trim: true })
  author_name?: string

  @IsEmail()
  @IsString()
  @IsOptional()
  @NormalizeString({ trim: true })
  author_email?: string
}
