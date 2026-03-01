/**
 * @file Article DTO
 * @module module/article/dto
 * @author Surmon <https://github.com/surmon-china>
 */

import { Transform } from 'class-transformer'
import { IsString, IsArray, IsBoolean, IsInt, IsEnum, IsNotEmpty, Min, Max } from 'class-validator'
import { IsOptional, IsDefined, ArrayNotEmpty, ArrayUnique } from 'class-validator'
import { IntersectionType, PartialType, PickType } from '@nestjs/mapped-types'
import { WithGuestPermission } from '@app/decorators/guest-permission.decorator'
import { unknownToNumber, unknownToBoolean } from '@app/transformers/value.transformer'
import { DateQueryDto, KeywordQueryDto } from '@app/dtos/querys.dto'
import { PaginateOptionWithHotSortDto } from '@app/dtos/paginate.dto'
import { ArticleStatus, ArticleOrigin, ArticleLanguage } from './article.constant'
import { Article } from './article.model'

export class CreateArticleDto extends PickType(Article, [
  'slug',
  'title',
  'content',
  'summary',
  'keywords',
  'thumbnail',
  'status',
  'origin',
  'lang',
  'featured',
  'disabled_comments',
  'tags',
  'categories',
  'extras'
] as const) {}

export class UpdateArticleDto extends PartialType(CreateArticleDto) {}

export class ArticlePaginateQueryDto extends IntersectionType(
  PaginateOptionWithHotSortDto,
  KeywordQueryDto,
  DateQueryDto
) {
  @WithGuestPermission({ only: [ArticleStatus.Published], default: ArticleStatus.Published })
  @IsEnum(ArticleStatus)
  @IsOptional()
  @Transform(({ value }) => unknownToNumber(value))
  status?: ArticleStatus

  @IsEnum(ArticleOrigin)
  @IsOptional()
  @Transform(({ value }) => unknownToNumber(value))
  origin?: ArticleOrigin

  @IsEnum(ArticleLanguage)
  @IsOptional()
  lang?: ArticleLanguage

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => unknownToBoolean(value))
  featured?: boolean

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  tag_slug?: string

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  category_slug?: string
}

export class ArticleContextQueryDto {
  @Min(2)
  @Max(20)
  @IsInt()
  @IsOptional()
  @Transform(({ value }) => unknownToNumber(value))
  related_count?: number
}

export class ArticleCalendarQueryDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  timezone?: string
}

export class ArticleIdsDto {
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsArray()
  @IsInt({ each: true })
  article_ids: number[]
}

export class ArticleIdsStatusDto extends ArticleIdsDto {
  @IsEnum(ArticleStatus)
  @IsDefined()
  status: ArticleStatus
}

export class AllArticlesQueryDto {
  @WithGuestPermission({ only: [false], default: false })
  @IsOptional()
  @Transform(({ value }) => unknownToBoolean(value))
  with_content?: boolean
}
