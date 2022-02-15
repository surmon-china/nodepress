/**
 * @file Article DTO
 * @module module/article/dto
 * @author Surmon <https://github.com/surmon-china>
 */

import { IntersectionType } from '@nestjs/mapped-types'
import { Transform } from 'class-transformer'
import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  IsDefined,
  IsIn,
  IsInt,
  Min,
  Max,
  ArrayNotEmpty,
  ArrayUnique,
} from 'class-validator'
import { PublishState, PublicState, OriginState } from '@app/interfaces/biz.interface'
import { WhenGuest } from '@app/decorators/guest.decorator'
import { unknowToNumber } from '@app/transformers/value.transformer'
import { DateQueryDTO, KeywordQueryDTO } from '@app/models/query.model'
import { PaginateOptionWithHotSortDTO } from '@app/models/paginate.model'
import { ARTICLE_PUBLISH_STATES, ARTICLE_PUBLIC_STATES, ARTICLE_ORIGIN_STATES } from './article.model'

export class ArticlePaginateQueryDTO extends IntersectionType(
  PaginateOptionWithHotSortDTO,
  KeywordQueryDTO,
  DateQueryDTO
) {
  @WhenGuest({ only: [PublishState.Published], default: PublishState.Published })
  @IsIn(ARTICLE_PUBLISH_STATES)
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => unknowToNumber(value))
  state?: PublishState

  @WhenGuest({ only: [PublicState.Public], default: PublicState.Public })
  @IsIn(ARTICLE_PUBLIC_STATES)
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => unknowToNumber(value))
  public?: PublicState

  @IsIn(ARTICLE_ORIGIN_STATES)
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => unknowToNumber(value))
  origin?: OriginState

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  tag_slug?: string

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  category_slug?: string
}

export class ArticleListQueryDTO {
  @Min(1)
  @Max(50)
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => unknowToNumber(value))
  count?: number
}

export class ArticleCalendarQueryDTO {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  timezone?: string
}

export class ArticleIDsDTO {
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsArray()
  article_ids: string[]
}

export class ArticlesStateDTO extends ArticleIDsDTO {
  @IsIn(ARTICLE_PUBLISH_STATES)
  @IsInt()
  @IsDefined()
  state: PublishState
}
