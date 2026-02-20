/**
 * @file General author DTO
 * @module dto/author
 * @author Surmon <https://github.com/surmon-china>
 */

import { Transform } from 'class-transformer'
import { IsString, IsEmail, MaxLength, IsOptional } from 'class-validator'

export class OptionalAuthorDto {
  @MaxLength(100)
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  author_name?: string

  @IsEmail()
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  author_email?: string
}
