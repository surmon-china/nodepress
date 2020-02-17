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
import { Sitemap, EnumChangefreq } from 'sitemap';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@app/transforms/model.transform';
import { CacheService, ICacheIoResult } from '@app/processors/cache/cache.service';
import { ESortType, EPublishState, EPublicState } from '@app/interfaces/state.interface';
import { MongooseModel } from '@app/interfaces/mongoose.interface';
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
    { url: urlMap.getSitemapPageUrl(), changefreq: EnumChangefreq.ALWAYS, priority: 1 },
    { url: urlMap.getGuestbookPageUrl(), changefreq: EnumChangefreq.ALWAYS, priority: 1 },
  ];

  private sitemapCache: ICacheIoResult<string>;

  constructor(
    private readonly cacheService: CacheService,
    @InjectModel(Tag) private readonly tagModel: MongooseModel<Tag>,
    @InjectModel(Article) private readonly articleModel: MongooseModel<Article>,
    @InjectModel(Category) private readonly categoryModel: MongooseModel<Category>,
  ) {
    this.sitemapCache = this.cacheService.promise({
      ioMode: true,
      key: CACHE_KEY.SITEMAP,
      promise: this.getMapXML.bind(this),
    });
    this.updateCache();
  }

  private getAllTags(): Promise<Tag[]> {
    return this.tagModel
      .find()
      .sort({ _id: ESortType.Desc })
      .exec();
  }

  private getAllCategories(): Promise<Category[]> {
    return this.categoryModel
      .find()
      .sort({ _id: ESortType.Desc })
      .exec();
  }

  private addAllArticles(): Promise<Article[]> {
    return this.articleModel
      .find({ state: EPublishState.Published, public: EPublicState.Public })
      .sort({ _id: ESortType.Desc })
      .exec()
  }

  // 构建地图
  private getMapXML(): Promise<string> {
    const sitemap = new Sitemap({
      cacheTime: 666666,
      urls: [...this.pagesMap]
    });
    return Promise.all([
      this.getAllCategories().then(categories => {
        categories.forEach(category => {
          sitemap.add({
            priority: 0.6,
            changefreq: EnumChangefreq.DAILY,
            url: urlMap.getCategoryUrl(category.slug),
          });
        });
      }),
      this.getAllTags().then(tags => {
        tags.forEach(tag => {
          sitemap.add({
            priority: 0.6,
            changefreq: EnumChangefreq.DAILY,
            url: urlMap.getTagUrl(tag.slug),
          });
        });
      }),
      this.addAllArticles().then(articles => {
        articles.forEach(article => {
          sitemap.add({
            priority: 0.8,
            changefreq: EnumChangefreq.DAILY,
            url: urlMap.getArticleUrl(article.id),
            lastmodISO: article.update_at.toISOString(),
          });
        });
      })
    ])
      .catch(error => console.warn('生成网站地图前获取数据发生错误：', error))
      .then(() => sitemap.toString(true))
  }

  // 获取地图缓存
  public getCache() {
    return this.sitemapCache.get();
  }

  // 更新地图缓存（内部首次实例化，外部主动调用）
  public updateCache() {
    return this.sitemapCache.update().then(xml => {
      // 每次缓存被更新时，都重新写入文件
      fs.writeFileSync(this.xmlFilePath, xml)
    });
  }
}
