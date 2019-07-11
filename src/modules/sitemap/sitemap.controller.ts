/**
 * Sitemap controller.
 * @file Sitemap 模块控制器
 * @module module/sitemap/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import { UseGuards, Response, Controller, Get, Patch } from '@nestjs/common';
import { JwtAuthGuard } from '@app/guards/auth.guard';
import { HttpProcessor } from '@app/decorators/http.decorator';
import { SitemapService } from './sitemap.service';

@Controller('sitemap')
export class SitemapController {

  constructor(private readonly sitemapService: SitemapService) {}

  @Get()
  @HttpProcessor.handle('获取网站地图')
  getSitemap(@Response() response): void {
    this.sitemapService.getCache().then(xml => {
      response.header('Content-Type', 'application/xml');
      response.send(xml);
    });
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('更新网站地图')
  updateSitemap(): Promise<any> {
    return this.sitemapService.updateCache();
  }
}
