/**
 * Sitemap service.
 * @file Sitemap 模块服务
 * @module module/sitemap/service
 * @author Surmon <https://github.com/surmon-china>
 */

import * as fs from 'fs';
import * as path from 'path';
import * as sitemap from 'sitemap';
import * as APP_CONFIG from '@app/app.config';
import * as CACHE_KEY from '@app/constants/cache.constant';
import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { TMongooseModel } from '@app/interfaces/mongoose.interface';
import { ESortType, EPublishState, EPublicState } from '@app/interfaces/state.interface';
import { CacheService, TCachePromiseIoResult } from '@app/processors/cache/cache.service';
import { Category } from '@app/modules/category/category.model';
import { Article } from '@app/modules/article/article.model';
import { Tag } from '@app/modules/tag/tag.model';

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

  constructor(
    private readonly cacheService: CacheService,
    @InjectModel(Tag) private readonly tagModel: TMongooseModel<Tag>,
    @InjectModel(Article) private readonly articleModel: TMongooseModel<Article>,
    @InjectModel(Category) private readonly categoryModel: TMongooseModel<Category>,
  ) {
    this.sitemapCache = this.cacheService.promise({
      ioMode: true,
      key: CACHE_KEY.SITEMAP,
      promise: this.getAndWriteSitemap.bind(this),
    });
  }

  // 获取并将地图写入文件
  private getAndWriteSitemap(): Promise<sitemap> {
    return this.reBuildSitemap().then(_ => {
      return new Promise((resolve, reject) => {
        this.sitemap.toXML((error, xml) => {
          if (error) {
            console.warn('生成地图 XML 时发生错误', error);
            return reject(error);
          } else {
            fs.writeFileSync(this.xmlFilePath, sitemap.toString());
            return resolve(xml);
          }
        });
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
      .then(_ => Promise.resolve(this.sitemap))
      .catch(error => {
        console.warn('生成地图前获取数据库发生错误', error);
        return Promise.resolve(this.sitemap);
      });
  }

  private addTagsMap() {
    return this.tagModel.find().sort({ _id: ESortType.Desc }).then(tags => {
      tags.forEach(tag => {
        this.sitemap.add({
          priority: 0.6,
          changefreq: 'daily',
          url: `/tag/${tag.slug}`,
        });
      });
      return tags;
    });
  }

  private addCategoriesMap() {
    return this.categoryModel.find().sort({ _id: ESortType.Desc }).then(categories => {
      categories.forEach(category => {
        this.sitemap.add({
          priority: 0.6,
          changefreq: 'daily',
          url: `/category/${category.slug}`,
        });
      });
      return categories;
    });
  }

  private addArticlesMap() {
    return this.articleModel
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
        return articles;
      });
  }

  // 获取地图缓存
  public getSitemapCache(): Promise<any> {
    return this.sitemapCache.get();
  }

  // 更新地图缓存
  public updateSitemap(): Promise<any> {
    return this.sitemapCache.update();
  }
}
