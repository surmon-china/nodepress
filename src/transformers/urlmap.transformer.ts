/**
 * @file URL transformer
 * @module transformer/link
 * @author Surmon <https://github.com/surmon-china>
 */

import { APP_BIZ } from '@app/app.config'
import { PAGES_ID } from '@app/constants/pages.constant'

export function getTagUrl(tagSlug: string): string {
  return `${APP_BIZ.FE_URL}/tag/${tagSlug}`
}

export function getCategoryUrl(categorySlug: string): string {
  return `${APP_BIZ.FE_URL}/category/${categorySlug}`
}

export function getArticleUrl(articleId: string | number): string {
  return `${APP_BIZ.FE_URL}/article/${articleId}`
}

export function getPageUrl(pageId: number): string {
  return `${APP_BIZ.FE_URL}/${PAGES_ID[pageId]}`
}

export function getPermalink(targetType: 'article' | 'page', targetId: number): string {
  return targetType === 'article' ? getArticleUrl(targetId) : getPageUrl(targetId)
}
