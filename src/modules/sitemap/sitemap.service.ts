/**
 * Sitemap service.
 * @file Sitemap 模块服务
 * @module module/sitemap/service
 * @author Surmon <https://github.com/surmon-china>
 */

import * as fs from 'fs';
import * as path from 'path';
import * as APP_CONFIG from '@app/app.config';
import * as CACHE_KEY from '@app/constants/cache.constant';
import * as urlMap from '@app/transforms/urlmap.transform';
import sitemap, { Sitemap, EnumChangefreq } from 'sitemap';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@app/transforms/model.transform';
import { CacheService, ICacheIoResult } from '@app/processors/cache/cache.service';
import { ESortType, EPublishState, EPublicState } from '@app/interfaces/state.interface';
import { TMongooseModel } from '@app/interfaces/mongoose.interface';
import { Category } from '@app/modules/category/category.model';
import { Article } from '@app/modules/article/article.model';
import { Tag } from '@app/modules/tag/tag.model';

@Injectable()
export class SitemapService {

  private xmlFilePath = path.format({
    dir: path.join(APP_CONFIG.APP.FRONT_END_PATH, 'static'),
    name: 'sitemap',
    ext: '.xml',
  });

  private pagesMap = [
    { url: APP_CONFIG.APP.URL, changefreq: EnumChangefreq.ALWAYS, priority: 1 },
    { url: urlMap.getVlogPageUrl(), changefreq: EnumChangefreq.MONTHLY, priority: 1 },
    { url: urlMap.getAboutPageUrl(), changefreq: EnumChangefreq.MONTHLY, priority: 1 },
    { url: urlMap.getProjectPageUrl(), changefreq: EnumChangefreq.MONTHLY, priority: 1 },
    { url: urlMap.getSitemapPageUrl(), changefreq: EnumChangefreq.ALWAYS, priority: 1 },
    { url: urlMap.getGuestbookPageUrl(), changefreq: EnumChangefreq.ALWAYS, priority: 1 },
  ];

  private sitemap: Sitemap;
  private sitemapCache: ICacheIoResult<any>;

  constructor(
    private readonly cacheService: CacheService,
    @InjectModel(Tag) private readonly tagModel: TMongooseModel<Tag>,
    @InjectModel(Article) private readonly articleModel: TMongooseModel<Article>,
    @InjectModel(Category) private readonly categoryModel: TMongooseModel<Category>,
  ) {
    this.sitemapCache = this.cacheService.promise({
      ioMode: true,
      key: CACHE_KEY.SITEMAP,
      promise: this.queryAndWriteToFile.bind(this),
    });
    this.updateCache();
  }

  // 获取并将地图写入文件
  private queryAndWriteToFile(): Promise<any> {
    return this.reBuild().then(_ => {
      return new Promise((resolve, reject) => {
        this.sitemap.toXML((error, xml) => {
          if (error) {
            console.warn('生成网站地图 XML 时发生错误', error);
            return reject(error);
          } else {
            fs.writeFileSync(this.xmlFilePath, this.sitemap.toString());
            return resolve(xml);
          }
        });
      });
    });
  }

  // 构建地图
  private reBuild(): Promise<Sitemap> {
    this.sitemap = sitemap.createSitemap({
      cacheTime: 666666,
      urls: [...this.pagesMap],
      // hostname: APP_CONFIG.APP.URL,
    });
    return Promise.all([
      this.addTagsMap(),
      this.addCategoriesMap(),
      this.addArticlesMap(),
    ])
      .then(_ => Promise.resolve(this.sitemap))
      .catch(error => {
        console.warn('生成网站地图前获取数据库发生错误', error);
        return Promise.resolve(this.sitemap);
      });
  }

  private addTagsMap(): Promise<Tag[]> {
    return this.tagModel
      .find()
      .sort({ _id: ESortType.Desc })
      .exec()
      .then(tags => {
        tags.forEach(tag => {
          this.sitemap.add({
            priority: 0.6,
            changefreq: EnumChangefreq.DAILY,
            url: urlMap.getTagUrl(tag.slug),
          });
        });
        return tags;
      });
  }

  private addCategoriesMap(): Promise<Category[]> {
    return this.categoryModel
      .find()
      .sort({ _id: ESortType.Desc })
      .exec()
      .then(categories => {
        categories.forEach(category => {
          this.sitemap.add({
            priority: 0.6,
            changefreq: EnumChangefreq.DAILY,
            url: urlMap.getCategoryUrl(category.slug),
          });
        });
        return categories;
      });
  }

  private addArticlesMap(): Promise<Article[]> {
    return this.articleModel
      .find({ state: EPublishState.Published, public: EPublicState.Public })
      .sort({ _id: ESortType.Desc })
      .exec()
      .then(articles => {
        articles.forEach(article => {
          this.sitemap.add({
            priority: 0.8,
            changefreq: EnumChangefreq.DAILY,
            url: urlMap.getArticleUrl(article.id),
            lastmodISO: article.update_at.toISOString(),
          });
        });
        return articles;
      });
  }

  // 获取地图缓存
  public getCache(): Promise<any> {
    return this.sitemapCache.get();
  }

  // 更新地图缓存
  public updateCache(): Promise<any> {
    return this.sitemapCache.update();
  }
}
