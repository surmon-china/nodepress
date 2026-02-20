/**
 * @file User me DTO
 * @module module/user/me/dto
 * @author Surmon <https://github.com/surmon-china>
 */

import { PickType } from '@nestjs/mapped-types'
import { IsBoolean, IsDefined } from 'class-validator'
import { User, UserIdentity } from '../user.model'

export class UpdateProfileDto extends PickType(User, ['name', 'email', 'website', 'avatar'] as const) {}

export class RemoveIdentityDto extends PickType(UserIdentity, ['provider'] as const) {}

export class DestroyAccountDto {
  @IsBoolean()
  @IsDefined()
  delete_comments: boolean
}
