/**
 * @file Article constants
 * @module module/article/constant
 * @author Surmon <https://github.com/surmon-china>
 */

import { SortOrder } from '@app/constants/sort.constant'

// publish status
export enum ArticleStatus {
  Draft = 0, // 草稿
  Published = 1, // 已发布
  Private = 2, // 私有
  Trash = -1 // 回收站
}

// origin state
export enum ArticleOrigin {
  Original = 0, // 原创
  Reprint = 1, // 转载
  Hybrid = 2 // 混合
}

// language https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
export enum ArticleLanguage {
  English = 'en', // English
  Chinese = 'zh', // 简体中文
  Multiple = 'mul' // 多语言混合
}

export const ARTICLE_PUBLIC_FILTER = Object.freeze({
  status: ArticleStatus.Published
} as const)

export const ARTICLE_LISTED_PUBLIC_FILTER = Object.freeze({
  ...ARTICLE_PUBLIC_FILTER,
  unlisted: false
} as const)

export const ARTICLE_HOTTEST_SORT_CONFIG = Object.freeze({
  'stats.comments': SortOrder.Desc,
  'stats.likes': SortOrder.Desc
} as const)
