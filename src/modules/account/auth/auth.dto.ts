/**
 * @file Auth DTO
 * @module module/account/auth/dto
 * @author Surmon <https://github.com/surmon-china>
 */

import { IsString, IsHexadecimal, IsOptional } from 'class-validator'
import { IsNotEmpty } from 'class-validator'

export class OAuthCallbackDto {
  @IsNotEmpty()
  @IsString()
  code: string

  @IsNotEmpty()
  @IsString()
  state: string
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
