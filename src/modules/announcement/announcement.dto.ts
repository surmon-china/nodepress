/**
 * @file Announcement DTO
 * @module module/announcement/dto
 * @author Surmon <https://github.com/surmon-china>
 */

import { IntersectionType } from '@nestjs/mapped-types'
import { Transform } from 'class-transformer'
import { IsInt, IsIn, IsNotEmpty, IsOptional, IsArray, ArrayNotEmpty, ArrayUnique } from 'class-validator'
import { unknowToNumber } from '@app/transformers/value.transformer'
import { WhenGuest } from '@app/decorators/guest.decorator'
import { PublishState } from '@app/interfaces/biz.interface'
import { PaginateOptionDTO } from '@app/models/paginate.model'
import { KeywordQueryDTO } from '@app/models/query.model'
import { ANNOUNCEMENT_STATES } from './announcement.model'

export class AnnouncementPaginateQueryDTO extends IntersectionType(PaginateOptionDTO, KeywordQueryDTO) {
  @WhenGuest({ only: [PublishState.Published], default: PublishState.Published })
  @IsIn(ANNOUNCEMENT_STATES)
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => unknowToNumber(value))
  state?: PublishState
}

export class AnnouncementsDTO {
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsArray()
  announcement_ids: string[]
}
