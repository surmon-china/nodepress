/**
 * @file Auth DTO
 * @module module/user/auth/dto
 * @author Surmon <https://github.com/surmon-china>
 */

import { IsString } from 'class-validator'
import { IsNotEmpty } from 'class-validator'

export class OAuthCallbackDto {
  @IsNotEmpty()
  @IsString()
  code: string

  @IsNotEmpty()
  @IsString()
  state: string
}
