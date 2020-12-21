/**
 * Syndication service.
 * @file Syndication 模块服务
 * @module module/syndication/service
 * @author Surmon <https://github.com/surmon-china>
 */

import fs from 'fs';
import path from 'path';
import RSS from 'rss';
import { Readable } from 'stream';
import { SitemapStream, streamToPromise, SitemapItemLoose, EnumChangefreq } from 'sitemap';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@app/transformers/model.transformer';
import { CacheService, ICacheIoResult, TCacheResult } from '@app/processors/cache/cache.service';
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

  private pagesMap: SitemapItemLoose[] = [
    // MARK: 不要与前端业务有耦合，所以 JOB LENS 等页面都不再加入 map
    { url: APP_CONFIG.APP.URL, changefreq: EnumChangefreq.ALWAYS, priority: 1 },
    { url: urlMap.getAboutPageUrl(), changefreq: EnumChangefreq.YEARLY, priority: 1 },
    { url: urlMap.getArchivePageUrl(), changefreq: EnumChangefreq.ALWAYS, priority: 1 },
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
      key: CACHE_KEY.RSS_XML,
      promise: this.getRSSXML.bind(this),
    });
    this.updateCache();
  }

  private getXmlFilePath(fileName: string): string {
    return path.format({
      dir: APP_CONFIG.APP.FRONT_END_PUBLIC_PATH,
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
  private async getMapXML(): Promise<string> {
    try {
      const sitemapItemList: SitemapItemLoose[] = [];
      const sitemapStream = new SitemapStream({
        hostname: APP_CONFIG.APP.URL,
      })

      await Promise.all([
        this.getAllCategories().then(categories => {
          categories.forEach(category => {
            sitemapItemList.push({
              priority: 0.6,
              changefreq: EnumChangefreq.DAILY,
              url: urlMap.getCategoryUrl(category.slug),
            });
          });
        }),
        this.getAllTags().then(tags => {
          tags.forEach(tag => {
            sitemapItemList.push({
              priority: 0.6,
              changefreq: EnumChangefreq.DAILY,
              url: urlMap.getTagUrl(tag.slug),
            });
          });
        }),
        this.getAllArticles().then(articles => {
          articles.forEach(article => {
            sitemapItemList.push({
              priority: 0.8,
              changefreq: EnumChangefreq.DAILY,
              url: urlMap.getArticleUrl(article.id),
              lastmodISO: article.update_at.toISOString(),
            });
          });
        })
      ]);

      const xmlData = await streamToPromise(Readable.from([
        ...this.pagesMap,
        ...sitemapItemList
      ]).pipe(sitemapStream))
      return xmlData.toString();

    } catch (error) {
      console.warn('生成网站地图前获取数据发生错误：', error)
    }
  }

  // 获取 RSS
  private async getRSSXML(): Promise<string> {
    const [categories, articles] = await Promise.all([
      this.getAllCategories(),
      this.getAllArticles(APP_CONFIG.APP.LIMIT)
    ]);
    const feed = new RSS({
      title: APP_CONFIG.APP.NAME,
      description: APP_CONFIG.APP.NAME,
      site_url: APP_CONFIG.APP.URL,
      feed_url: `${APP_CONFIG.APP.URL}/rss.xml`,
      image_url: `${APP_CONFIG.APP.URL}/icon.png`,
      managingEditor: APP_CONFIG.APP.MASTER,
      webMaster: APP_CONFIG.APP.MASTER,
      generator: `${APP_CONFIG.PROJECT.name} ${APP_CONFIG.PROJECT.version}`,
      categories: categories.map(category => category.slug),
      copyright: `${new Date().getFullYear()} ${APP_CONFIG.APP.NAME}`,
      language: 'zh',
      ttl: 60
    });
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
    }));
    return feed.xml({ indent: true })
  }

  // 获取地图缓存
  public getSitemapCache(): TCacheResult<string> {
    return this.sitemapCache.get();
  }

  // 获取 RSS 缓存
  public getRSSCache(): TCacheResult<string> {
    return this.rssCache.get();
  }

  // 更新地图缓存（内部首次实例化，外部主动调用）每次缓存被更新时，都重新写入文件
  public updateCache(): Promise<any> {
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
