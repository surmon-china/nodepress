/**
 * @file User account DTO
 * @module module/account/dto
 * @author Surmon <https://github.com/surmon-china>
 */

import { PickType } from '@nestjs/mapped-types'
import { IsBoolean, IsOptional } from 'class-validator'
import { User } from '@app/modules/user/user.model'

export class UpdateProfileDto extends PickType(User, ['name', 'email', 'website', 'avatar_url'] as const) {}

export class DeletionRequestDto {
  @IsBoolean()
  @IsOptional()
  delete_comments?: boolean
}
