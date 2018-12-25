/**
 * App module.
 * @file App 主模块
 * @module app.module
 * @author Surmon <https://github.com/surmon-china>
 */

import { APP_INTERCEPTOR } from '@nestjs/core';
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from '@app/app.controller';
import { HttpCacheInterceptor } from '@app/interceptors/cache.interceptor';
import { CorsMiddleware } from '@app/middlewares/cors.middleware';
import { OriginMiddleware } from '@app/middlewares/origin.middleware';
import { CacheModule } from '@app/processors/cache/cache.module';
import { DatabaseModule } from '@app/processors/database/database.module';

import { AuthModule } from '@app/modules/auth/auth.module';
import { AnnouncementModule } from '@app/modules/announcement/announcement.module';
import { UtilsModule } from '@app/modules/utils/utils.module';
import { MusicModule } from '@app/modules/music/music.module';
import { OptionModule } from '@app/modules/option/option.module';
import { WallpaperModule } from '@app/modules/wallpaper/wallpaper.module';

@Module({
  imports: [
    DatabaseModule,
    CacheModule,
    AuthModule,
    AnnouncementModule,
    OptionModule,
    WallpaperModule,
    MusicModule,
    UtilsModule,
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
