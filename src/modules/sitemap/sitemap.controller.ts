/**
 * Sitemap controller.
 * @file Sitemap 模块控制器
 * @module module/sitemap/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import { Controller, Get } from '@nestjs/common';
import { SitemapService } from './sitemap.service';
import { HttpProcessor } from '@app/decorators/http.decorator';

@Controller('sitemap.xml')
export class SitemapController {

  constructor(private readonly sitemapService: SitemapService) {}

  @Get()
  @HttpProcessor.handle('获取网站地图')
  getSitemap(): Promise<any> {
    return this.sitemapService.getCache();
  }
}
