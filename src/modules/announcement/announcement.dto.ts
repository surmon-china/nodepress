/**
 * @file Announcement DTO
 * @module module/announcement/dto
 * @author Surmon <https://github.com/surmon-china>
 */

import { IntersectionType } from '@nestjs/mapped-types'
import { Transform } from 'class-transformer'
import { IsInt, IsIn, IsNotEmpty, IsOptional, IsArray, ArrayNotEmpty, ArrayUnique } from 'class-validator'
import { unknownToNumber } from '@app/transformers/value.transformer'
import { WithGuestPermission } from '@app/decorators/guest-permission.decorator'
import { PaginateOptionDTO } from '@app/models/paginate.model'
import { KeywordQueryDTO } from '@app/models/query.model'
import { AnnouncementStatus, ANNOUNCEMENT_STATUSES } from './announcement.constant'

export class AnnouncementPaginateQueryDTO extends IntersectionType(PaginateOptionDTO, KeywordQueryDTO) {
  @WithGuestPermission({
    only: [AnnouncementStatus.Published],
    default: AnnouncementStatus.Published
  })
  @IsIn(ANNOUNCEMENT_STATUSES)
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => unknownToNumber(value))
  status?: AnnouncementStatus
}

export class AnnouncementsDTO {
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsArray()
  announcement_ids: string[]
}
