/**
 * Syndication controller.
 * @file Syndication 模块控制器
 * @module module/syndication/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import { UseGuards, Response, Controller, Get, Patch } from '@nestjs/common';
import { JwtAuthGuard } from '@app/guards/auth.guard';
import { HttpProcessor } from '@app/decorators/http.decorator';
import { SyndicationService } from './syndication.service';

@Controller('syndication')
export class SyndicationController {

  constructor(private readonly syndicationService: SyndicationService) {}

  @Get('sitemap')
  @HttpProcessor.handle('获取网站地图')
  getSitemapXML(@Response() response): void {
    this.syndicationService.getSitemapCache().then(xml => {
      response.header('Content-Type', 'application/xml');
      response.send(xml);
    });
  }

  @Get('rss')
  @HttpProcessor.handle('获取 RSS 订阅')
  getRSSXML(@Response() response): void {
    this.syndicationService.getRSSCache().then(xml => {
      response.header('Content-Type', 'application/xml');
      response.send(xml);
    });
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  @HttpProcessor.handle('更新聚合供稿')
  updateData(): Promise<any> {
    return this.syndicationService.updateCache();
  }
}
