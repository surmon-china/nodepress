/**
 * @file URL transformer
 * @module transformer/link
 * @author Surmon <https://github.com/surmon-china>
 */

import { GUESTBOOK_POST_ID } from '@app/constants/biz.constant'
import * as APP_CONFIG from '@app/app.config'

export function getTagUrl(tagSlug: string): string {
  return `${APP_CONFIG.APP_BIZ.FE_URL}/tag/${tagSlug}`
}

export function getCategoryUrl(categorySlug: string): string {
  return `${APP_CONFIG.APP_BIZ.FE_URL}/category/${categorySlug}`
}

export function getArticleUrl(articleId: string | number): string {
  return `${APP_CONFIG.APP_BIZ.FE_URL}/article/${articleId}`
}

export function getGuestbookPageUrl(): string {
  return `${APP_CONFIG.APP_BIZ.FE_URL}/guestbook`
}

export function getPermalinkById(id: number): string {
  return id === GUESTBOOK_POST_ID ? getGuestbookPageUrl() : getArticleUrl(id)
}
