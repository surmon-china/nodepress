/**
 * Sitemap controller.
 * @file Sitemap 模块控制器
 * @module module/sitemap/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import { UseGuards, Controller, Get, Patch } from '@nestjs/common';
import { JwtAuthGuard } from '@app/guards/auth.guard';
import { SitemapService } from './sitemap.service';
import { HttpProcessor } from '@app/decorators/http.decorator';

@Controller('sitemap')
export class SitemapController {

  constructor(private readonly sitemapService: SitemapService) {}

  @Get()
  @HttpProcessor.handle('获取网站地图')
  getSitemap(): Promise<any> {
    return this.sitemapService.getCache();
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('更新网站地图')
  updateSitemap(): Promise<any> {
    return this.sitemapService.updateCache();
  }
}
