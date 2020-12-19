/**
 * App module.
 * @file App 主模块
 * @module app/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { APP_INTERCEPTOR } from '@nestjs/core';
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from '@app/app.controller';

// 拦截器
import { HttpCacheInterceptor } from '@app/interceptors/cache.interceptor';

// 中间件
import { CorsMiddleware } from '@app/middlewares/cors.middleware';
import { OriginMiddleware } from '@app/middlewares/origin.middleware';

// 公共模块
import { DatabaseModule } from '@app/processors/database/database.module';
import { CacheModule } from '@app/processors/cache/cache.module';
import { HelperModule } from '@app/processors/helper/helper.module';

// 业务模块（辅助）
import { SyndicationModule } from '@app/modules/syndication/syndication.module';
import { ExpansionModule } from '@app/modules/expansion/expansion.module';

// 业务模块（核心）
import { AuthModule } from '@app/modules/auth/auth.module';
import { OptionModule } from '@app/modules/option/option.module';
import { AnnouncementModule } from '@app/modules/announcement/announcement.module';
import { TagModule } from '@app/modules/tag/tag.module';
import { CategoryModule } from '@app/modules/category/category.module';
import { ArticleModule } from '@app/modules/article/article.module';
import { CommentModule } from '@app/modules/comment/comment.module';
import { LikeModule } from '@app/modules/like/like.module';

@Module({
  imports: [
    HelperModule,
    DatabaseModule,
    CacheModule,

    AuthModule,
    OptionModule,
    AnnouncementModule,
    TagModule,
    CategoryModule,
    ArticleModule,
    CommentModule,
    LikeModule,

    ExpansionModule,
    SyndicationModule,
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
