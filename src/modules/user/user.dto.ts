/**
 * @file User DTO
 * @module module/user/dto
 * @author Surmon <https://github.com/surmon-china>
 */

import { Transform } from 'class-transformer'
import { IsBoolean, IsEnum, IsOptional } from 'class-validator'
import { IntersectionType, PickType, PartialType } from '@nestjs/mapped-types'
import { PaginateOptionDto } from '@app/dtos/paginate.dto'
import { KeywordQueryDto } from '@app/dtos/querys.dto'
import { unknownToBoolean, unknownToNumber } from '@app/transformers/value.transformer'
import { UserType } from './user.constant'
import { User } from './user.model'

export class CreateUserDto extends PickType(User, [
  'type',
  'name',
  'email',
  'website',
  'avatar_url',
  'identities',
  'extras'
] as const) {}

export class UpdateUserDto extends IntersectionType(
  PartialType(CreateUserDto),
  PartialType(PickType(User, ['disabled'] as const))
) {}

export class UserPaginateQueryDto extends IntersectionType(PaginateOptionDto, KeywordQueryDto) {
  @IsEnum(UserType)
  @IsOptional()
  @Transform(({ value }) => unknownToNumber(value))
  type?: UserType

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => unknownToBoolean(value))
  disabled?: boolean
}
