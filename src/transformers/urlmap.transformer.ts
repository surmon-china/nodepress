/**
 * @file URL transformer
 * @description 构造各种链接
 * @module transformer/link
 * @author Surmon <https://github.com/surmon-china>
 */

import { CommentPostID } from '@app/interfaces/biz.interface'
import * as APP_CONFIG from '@app/app.config'

export function getTagUrl(tagSlug: string): string {
  return `${APP_CONFIG.APP.FE_URL}/tag/${tagSlug}`
}

export function getCategoryUrl(categorySlug: string): string {
  return `${APP_CONFIG.APP.FE_URL}/category/${categorySlug}`
}

export function getArticleUrl(articleId: string | number): string {
  return `${APP_CONFIG.APP.FE_URL}/article/${articleId}`
}

export function getGuestbookPageUrl(): string {
  return `${APP_CONFIG.APP.FE_URL}/guestbook`
}

export function getPermalinkByID(id: number): string {
  return id === CommentPostID.Guestbook ? getGuestbookPageUrl() : getArticleUrl(id)
}
