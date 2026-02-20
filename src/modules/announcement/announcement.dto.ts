/**
 * @file Announcement DTO
 * @module module/announcement/dto
 * @author Surmon <https://github.com/surmon-china>
 */

import { Transform } from 'class-transformer'
import { IsEnum, IsInt, IsOptional, IsArray, ArrayNotEmpty, ArrayUnique } from 'class-validator'
import { IntersectionType, PartialType, PickType } from '@nestjs/mapped-types'
import { WithGuestPermission } from '@app/decorators/guest-permission.decorator'
import { unknownToNumber } from '@app/transformers/value.transformer'
import { PaginateOptionDto } from '@app/dtos/paginate.dto'
import { KeywordQueryDto } from '@app/dtos/querys.dto'
import { AnnouncementStatus } from './announcement.constant'
import { Announcement } from './announcement.model'

export class CreateAnnouncementDto extends PickType(Announcement, ['content', 'status'] as const) {}

export class UpdateAnnouncementDto extends PartialType(CreateAnnouncementDto) {}

export class AnnouncementPaginateQueryDto extends IntersectionType(PaginateOptionDto, KeywordQueryDto) {
  @WithGuestPermission({
    only: [AnnouncementStatus.Published],
    default: AnnouncementStatus.Published
  })
  @IsEnum(AnnouncementStatus)
  @IsOptional()
  @Transform(({ value }) => unknownToNumber(value))
  status?: AnnouncementStatus
}

export class AnnouncementIdsDto {
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsArray()
  @IsInt({ each: true })
  announcement_ids: number[]
}
