/**
 * Syndication service.
 * @file Syndication 模块服务
 * @module module/syndication/service
 * @author Surmon <https://github.com/surmon-china>
 */

import fs from 'fs';
import path from 'path';
import RSS from 'rss';
import { Sitemap, EnumChangefreq } from 'sitemap';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@app/transformers/model.transformer';
import { CacheService, ICacheIoResult } from '@app/processors/cache/cache.service';
import { ESortType, EPublishState, EPublicState } from '@app/interfaces/state.interface';
import { MongooseModel } from '@app/interfaces/mongoose.interface';
import { Category } from '@app/modules/category/category.model';
import { Article } from '@app/modules/article/article.model';
import { Tag } from '@app/modules/tag/tag.model';
import * as APP_CONFIG from '@app/app.config';
import * as CACHE_KEY from '@app/constants/cache.constant';
import * as urlMap from '@app/transformers/urlmap.transformer';

@Injectable()
export class SyndicationService {

  private pagesMap = [
    { url: APP_CONFIG.APP.URL, changefreq: EnumChangefreq.ALWAYS, priority: 1 },
    { url: urlMap.getVlogPageUrl(), changefreq: EnumChangefreq.MONTHLY, priority: 1 },
    { url: urlMap.getAboutPageUrl(), changefreq: EnumChangefreq.MONTHLY, priority: 1 },
    { url: urlMap.getSitemapPageUrl(), changefreq: EnumChangefreq.ALWAYS, priority: 1 },
    { url: urlMap.getGuestbookPageUrl(), changefreq: EnumChangefreq.ALWAYS, priority: 1 },
  ];

  private sitemapCache: ICacheIoResult<string>;
  private rssCache: ICacheIoResult<string>;

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
    this.rssCache = this.cacheService.promise({
      ioMode: true,
      key: CACHE_KEY.RSSXML,
      promise: this.getRSSXML.bind(this),
    });
    this.updateCache();
  }

  private getXmlFilePath(fileName: string): string {
    return path.format({
      dir: path.join(APP_CONFIG.APP.FRONT_END_PATH, 'static'),
      name: fileName,
      ext: '.xml',
    });
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

  private getAllArticles(limit?: number): Promise<Article[]> {
    return this.articleModel
      .find({ state: EPublishState.Published, public: EPublicState.Public })
      .sort({ _id: ESortType.Desc })
      .limit(limit)
      .exec()
  }

  // 获取地图
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
      this.getAllArticles().then(articles => {
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

  // 获取 RSS
  private getRSSXML(): Promise<string> {
    return Promise.all([
      this.getAllCategories(),
      this.getAllArticles(APP_CONFIG.APP.LIMIT)
    ]).then(([categories, articles]) => {
      const feed = new RSS({
        title: APP_CONFIG.APP.NAME,
        description: APP_CONFIG.APP.NAME,
        site_url: APP_CONFIG.APP.URL,
        feed_url: `${APP_CONFIG.APP.URL}/rss.xml`,
        image_url: `${APP_CONFIG.APP.URL}/icon.png`,
        managingEditor: APP_CONFIG.APP.MASTER,
        webMaster: APP_CONFIG.APP.MASTER,
        generator: `${APP_CONFIG.INFO.name} ${APP_CONFIG.INFO.version}`,
        categories: categories.map(category => category.slug),
        copyright: `${new Date().getFullYear()} ${APP_CONFIG.APP.NAME}`,
        language: 'zh',
        ttl: 60
      })
      articles.forEach(article => feed.item({
        title: article.title,
        description: article.description,
        url: urlMap.getArticleUrl(article.id),
        guid: article._id.toHexString(),
        categories: article.category.map((category: Category) => category.slug),
        author: APP_CONFIG.APP.MASTER,
        date: article.create_at,
        enclosure: {
          url: article.thumb
        }
      }))
      return feed.xml({ indent: true })
    })
  }

  // 获取地图缓存
  public getSitemapCache() {
    return this.sitemapCache.get();
  }

  // 获取 RSS 缓存
  public getRSSCache() {
    return this.rssCache.get();
  }

  // 更新地图缓存（内部首次实例化，外部主动调用）每次缓存被更新时，都重新写入文件
  public updateCache() {
    return Promise.all([
      this.sitemapCache.update().then(xml => {
        fs.writeFileSync(this.getXmlFilePath('sitemap'), xml)
      }),
      this.rssCache.update().then(xml => {
        fs.writeFileSync(this.getXmlFilePath('rss'), xml)
      }),
    ])
  }
}
