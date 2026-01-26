/**
 * @file Article DTO
 * @module module/article/dto
 * @author Surmon <https://github.com/surmon-china>
 */

import { IntersectionType } from '@nestjs/mapped-types'
import { Transform } from 'class-transformer'
import { IsString, IsArray, IsBoolean, IsIn, IsInt } from 'class-validator'
import { IsNotEmpty, IsOptional, IsDefined, ArrayNotEmpty, ArrayUnique } from 'class-validator'
import { WithGuestPermission } from '@app/decorators/guest-permission.decorator'
import { unknownToNumber, unknownToBoolean } from '@app/transformers/value.transformer'
import { DateQueryDTO, KeywordQueryDTO } from '@app/models/query.model'
import { PaginateOptionWithHotSortDTO } from '@app/models/paginate.model'
import { ARTICLE_STATUSES, ARTICLE_ORIGINS, ARTICLE_LANGUAGES } from './article.constant'
import { ArticleStatus, ArticleOrigin } from './article.constant'

export class ArticlePaginateQueryDTO extends IntersectionType(
  PaginateOptionWithHotSortDTO,
  KeywordQueryDTO,
  DateQueryDTO
) {
  @WithGuestPermission({ only: [ArticleStatus.Published], default: ArticleStatus.Published })
  @IsIn(ARTICLE_STATUSES)
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => unknownToNumber(value))
  status?: ArticleStatus

  @IsIn(ARTICLE_ORIGINS)
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => unknownToNumber(value))
  origin?: ArticleOrigin

  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => unknownToBoolean(value))
  featured?: boolean

  @IsIn(ARTICLE_LANGUAGES)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  lang: string

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  tag_slug?: string

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  category_slug?: string
}

export class ArticleCalendarQueryDTO {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  timezone?: string
}

export class ArticleIdsDTO {
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsArray()
  article_ids: string[]
}

export class ArticlesStatusDTO extends ArticleIdsDTO {
  @IsIn(ARTICLE_STATUSES)
  @IsInt()
  @IsDefined()
  status: ArticleStatus
}
