/**
 * @file App module
 * @module app/module
 * @author Surmon <https://github.com/surmon-china>
 */

import { APP_INTERCEPTOR } from '@nestjs/core'
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { AppController } from '@app/app.controller'

// 拦截器
import { HttpCacheInterceptor } from '@app/interceptors/cache.interceptor'

// 中间件
import { CorsMiddleware } from '@app/middlewares/cors.middleware'
import { OriginMiddleware } from '@app/middlewares/origin.middleware'

// 公共模块
import { DatabaseModule } from '@app/processors/database/database.module'
import { CacheModule } from '@app/processors/cache/cache.module'
import { HelperModule } from '@app/processors/helper/helper.module'

// 业务模块（辅助）
import { ExpansionModule } from '@app/modules/expansion/expansion.module'

// 业务模块（核心）
import { AuthModule } from '@app/modules/auth/auth.module'
import { OptionModule } from '@app/modules/option/option.module'
import { AnnouncementModule } from '@app/modules/announcement/announcement.module'
import { TagModule } from '@app/modules/tag/tag.module'
import { CategoryModule } from '@app/modules/category/category.module'
import { ArticleModule } from '@app/modules/article/article.module'
import { CommentModule } from '@app/modules/comment/comment.module'
import { DisqusModule } from '@app/modules/disqus/disqus.module'
import { ArchiveModule } from '@app/modules/archive/archive.module'
import { VoteModule } from '@app/modules/vote/vote.module'

@Module({
  imports: [
    HelperModule,
    DatabaseModule,
    CacheModule,
    ExpansionModule,

    AuthModule,
    OptionModule,
    AnnouncementModule,
    TagModule,
    CategoryModule,
    ArticleModule,
    CommentModule,
    DisqusModule,
    ArchiveModule,
    VoteModule,
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
    consumer.apply(CorsMiddleware, OriginMiddleware).forRoutes('*')
  }
}
