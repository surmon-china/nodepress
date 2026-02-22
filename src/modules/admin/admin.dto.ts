/**
 * @file Admin DTO
 * @module module/admin/dto
 * @author Surmon <https://github.com/surmon-china>
 */

import { Transform } from 'class-transformer'
import { IsString, IsBase64, IsOptional, IsNotEmpty } from 'class-validator'

export class AuthLoginDto {
  @IsBase64()
  @IsString()
  @IsNotEmpty()
  password: string
}

export class UpdateProfileDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  name: string

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  slogan: string

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  avatar_url: string

  @IsBase64()
  @IsString()
  @IsOptional()
  password?: string

  @IsBase64()
  @IsString()
  @IsOptional()
  new_password?: string
}
