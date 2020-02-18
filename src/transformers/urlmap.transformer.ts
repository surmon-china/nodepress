/**
 * @file 链接构造器
 * @description 构造各种链接
 * @module transformer/link
 * @author Surmon <https://github.com/surmon-china>
 */

import * as APP_CONFIG from '@app/app.config';

const TAG_PATH = 'tag';
const CATEGORY_PATH = 'category';
const ARTICLE_PATH = 'article';
const GUESTBOOK_PAGE_PATH = 'guestbook';
const VLOG_PAGE_PATH = 'vlog';
const ABOUT_PAGE_PATH = 'about';
const SITEMAP_PAGE_PATH = 'sitemap';

export function getTagUrl(tagSlug: string): string {
  return `${APP_CONFIG.APP.URL}/${TAG_PATH}/${tagSlug}`;
}

export function getCategoryUrl(categorySlug: string): string {
  return `${APP_CONFIG.APP.URL}/${CATEGORY_PATH}/${categorySlug}`;
}

export function getArticleUrl(articleId: string | number): string {
  return `${APP_CONFIG.APP.URL}/${ARTICLE_PATH}/${articleId}`;
}

export function getGuestbookPageUrl(): string {
  return `${APP_CONFIG.APP.URL}/${GUESTBOOK_PAGE_PATH}`;
}

export function getVlogPageUrl(): string {
  return `${APP_CONFIG.APP.URL}/${VLOG_PAGE_PATH}`;
}

export function getAboutPageUrl(): string {
  return `${APP_CONFIG.APP.URL}/${ABOUT_PAGE_PATH}`;
}

export function getSitemapPageUrl(): string {
  return `${APP_CONFIG.APP.URL}/${SITEMAP_PAGE_PATH}`;
}
