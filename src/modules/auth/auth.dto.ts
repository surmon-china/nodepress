/**
 * @file Auth DTO
 * @module module/auth/dto
 * @author Surmon <https://github.com/surmon-china>
 */

import { IsString, IsDefined, IsNotEmpty } from 'class-validator'
import { Auth } from './auth.model'

export class AuthLoginDTO {
  @IsString({ message: 'password must be string type' })
  @IsNotEmpty({ message: 'password?' })
  @IsDefined()
  password: string
}

export class AuthUpdateDTO extends Auth {
  new_password?: string
}
