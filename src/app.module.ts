/**
 * App module.
 * @file App 主模块
 * @module app/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { APP_INTERCEPTOR } from '@nestjs/core';
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';

// 控制器
import { AppController } from '@app/app.controller';

// 拦截器
import { HttpCacheInterceptor } from '@app/interceptors/cache.interceptor';

// 中间件
import { CorsMiddleware } from '@app/middlewares/cors.middleware';
import { OriginMiddleware } from '@app/middlewares/origin.middleware';

// 公共模块
import { CacheModule } from '@app/processors/cache/cache.module';
import { DatabaseModule } from '@app/processors/database/database.module';
import { HelperModule } from '@app/processors/helper/helper.module';

// 业务模块
import { AuthModule } from '@app/modules/auth/auth.module';
import { SitemapModule } from '@app/modules/sitemap/sitemap.module';
import { AnnouncementModule } from '@app/modules/announcement/announcement.module';
import { TagModule } from '@app/modules/tag/tag.module';
import { MusicModule } from '@app/modules/music/music.module';
import { OptionModule } from '@app/modules/option/option.module';
import { WallpaperModule } from '@app/modules/wallpaper/wallpaper.module';
import { ExtendedModule } from '@app/modules/extended/extended.module';

@Module({
  imports: [
    DatabaseModule,
    CacheModule,
    HelperModule,
    AuthModule,
    SitemapModule,
    AnnouncementModule,
    TagModule,
    OptionModule,
    WallpaperModule,
    MusicModule,
    ExtendedModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpCacheInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorsMiddleware, OriginMiddleware).forRoutes('*');
  }
}
