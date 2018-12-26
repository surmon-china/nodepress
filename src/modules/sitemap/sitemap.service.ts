/**
 * Sitemap service.
 * @file Sitemap 模块服务
 * @module modules/sitemap/service
 * @author Surmon <https://github.com/surmon-china>
 */

import * as fs from 'fs';
import * as path from 'path';
import * as sitemap from 'sitemap';
import * as APP_CONFIG from '@app/app.config';
import * as CACHE_KEY from '@app/constants/cache.constant';
import { Injectable } from '@nestjs/common';
import { ESortType, EPublishState, EPublicState } from '@app/interfaces/state.interface';
import { CacheService, TCachePromiseIoResult } from '@app/processors/cache/cache.service';
// const Tag = require('np-model/tag.model')
// const Article = require('np-model/article.model')
// const Category = require('np-model/category.model')

@Injectable()
export class SitemapService {

  xmlFilePath = path.format({
    dir: path.join(APP_CONFIG.APP.FRONT_END_PATH, 'static'),
    name: 'sitemap',
    ext: '.xml',
  });

  pagesMap = [
    { url: '', changefreq: 'always', priority: 1 },
    { url: '/about', changefreq: 'monthly', priority: 1 },
    { url: '/project', changefreq: 'monthly', priority: 1 },
    { url: '/sitemap', changefreq: 'always', priority: 1 },
    { url: '/guestbook', changefreq: 'always', priority: 1 },
  ];

  private sitemap: sitemap;
  private sitemapCache: TCachePromiseIoResult;

  constructor(private readonly cacheService: CacheService) {
    this.sitemapCache = this.cacheService.promise({
      ioMode: true,
      key: CACHE_KEY.SITEMAP,
      promise: this.getAndWriteSitemap.bind(this),
    });
  }

  // 获取地图缓存
  getSitemapCache(): Promise<any> {
    return this.sitemapCache.get();
  }

  // 更新地图缓存
  updateSitemap(): Promise<any> {
    return this.sitemapCache.update();
  }

  // 获取并将地图写入文件
  private getAndWriteSitemap(): Promise<sitemap> {
    return this.reBuildSitemap().then(_ => {
      this.sitemap.toXML((error, xml) => {
        if (error) {
          console.warn('生成地图 XML 时发生错误', error);
          return Promise.reject(error);
        } else {
          fs.writeFileSync(this.xmlFilePath, sitemap.toString());
          return Promise.resolve(xml);
        }
      });
    });
  }

  // 构建地图
  private reBuildSitemap(): Promise<sitemap> {
    this.sitemap = sitemap.createSitemap({
      cacheTime: 666666,
      urls: [...this.pagesMap],
      hostname: APP_CONFIG.APP.URL,
    });
    return Promise.all([this.addTagsMap(), this.addCategoriesMap(), this.addArticlesMap()])
      .then(data => Promise.resolve(this.sitemap))
      .catch(error => {
        console.warn('生成地图前获取数据库发生错误', error);
        return Promise.resolve(this.sitemap);
      });
  }

  private addTagsMap() {
    return Tag.find().sort({ _id: ESortType.Desc }).then(tags => {
      tags.forEach(tag => {
        this.sitemap.add({
          priority: 0.6,
          changefreq: 'daily',
          url: `/tag/${tag.slug}`,
        });
      });
    });
  }

  private addCategoriesMap() {
    return Category.find().sort({ _id: ESortType.Desc }).then(categories => {
      categories.forEach(category => {
        this.sitemap.add({
          priority: 0.6,
          changefreq: 'daily',
          url: `/category/${category.slug}`,
        });
      });
    });
  }

  private addArticlesMap() {
    return Article
      .find({ state: EPublishState.Published, public: EPublicState.Public })
      .sort({ _id: ESortType.Desc })
      .then(articles => {
        articles.forEach(article => {
          this.sitemap.add({
            priority: 0.8,
            changefreq: 'daily',
            url: `/article/${article.id}`,
            lastmodISO: article.create_at.toISOString(),
          });
        });
      });
  }
}