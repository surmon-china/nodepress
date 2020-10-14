/**
 * @file 链接构造器
 * @description 构造各种链接
 * @module transformer/link
 * @author Surmon <https://github.com/surmon-china>
 */

import * as APP_CONFIG from '@app/app.config';

export function getTagUrl(tagSlug: string): string {
  return `${APP_CONFIG.APP.URL}/tag/${tagSlug}`;
}

export function getCategoryUrl(categorySlug: string): string {
  return `${APP_CONFIG.APP.URL}/category/${categorySlug}`;
}

export function getArticleUrl(articleId: string | number): string {
  return `${APP_CONFIG.APP.URL}/article/${articleId}`;
}

export function getGuestbookPageUrl(): string {
  return `${APP_CONFIG.APP.URL}/guestbook`;
}

export function getLensPageUrl(): string {
  return `${APP_CONFIG.APP.URL}/lens`;
}

export function getAboutPageUrl(): string {
  return `${APP_CONFIG.APP.URL}/about`;
}

export function getSitemapPageUrl(): string {
  return `${APP_CONFIG.APP.URL}/sitemap`;
}
