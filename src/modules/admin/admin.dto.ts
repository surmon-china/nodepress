/**
 * @file Admin DTO
 * @module module/admin/dto
 * @author Surmon <https://github.com/surmon-china>
 */

import { IsString, IsDefined, IsNotEmpty } from 'class-validator'
import { Admin } from './admin.model'

export class AuthLoginDTO {
  @IsString({ message: 'password must be string type' })
  @IsNotEmpty({ message: 'password?' })
  @IsDefined()
  password: string
}

export class AdminUpdateDTO extends Admin {
  new_password?: string
}
