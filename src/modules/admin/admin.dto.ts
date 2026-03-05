/**
 * @file Admin DTO
 * @module module/admin/dto
 * @author Surmon <https://github.com/surmon-china>
 */

import { IsString, IsBase64, IsHexadecimal, IsOptional, IsNotEmpty } from 'class-validator'
import { NormalizeString } from '@app/decorators/normalize-string.decorator'

export class AuthLoginDto {
  @IsBase64()
  @IsString()
  @IsNotEmpty()
  password: string
}

export class AuthLogoutDto {
  @IsHexadecimal()
  @IsString()
  @IsOptional()
  refresh_token?: string
}

export class AuthRefreshTokenDto {
  @IsHexadecimal()
  @IsString()
  @IsNotEmpty()
  refresh_token: string
}

export class UpdateProfileDto {
  @IsString()
  @IsNotEmpty()
  @NormalizeString({ trim: true })
  name: string

  @IsString()
  @IsOptional()
  @NormalizeString({ trim: true })
  slogan: string

  @IsString()
  @IsOptional()
  @NormalizeString({ trim: true })
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
