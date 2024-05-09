/**
 * @file App module
 * @module app/module
 * @author Surmon <https://github.com/surmon-china>
 */

import type { Request } from 'express'
import { APP_INTERCEPTOR, APP_GUARD, APP_PIPE } from '@nestjs/core'
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { ThrottlerGuard, ThrottlerModule, minutes } from '@nestjs/throttler'
import { AppController } from '@app/app.controller'

// framework
import { CacheInterceptor } from '@app/interceptors/cache.interceptor'
import { ValidationPipe } from '@app/pipes/validation.pipe'

// middlewares
import { CorsMiddleware } from '@app/middlewares/cors.middleware'
import { OriginMiddleware } from '@app/middlewares/origin.middleware'

// universal modules
import { DatabaseModule } from '@app/processors/database/database.module'
import { CacheModule } from '@app/processors/cache/cache.module'
import { HelperModule } from '@app/processors/helper/helper.module'

// BIZ helper module
import { ExpansionModule } from '@app/modules/expansion/expansion.module'

// BIZ modules
import { AuthModule } from '@app/modules/auth/auth.module'
import { OptionModule } from '@app/modules/option/option.module'
import { FeedbackModule } from '@app/modules/feedback/feedback.module'
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
    // https://github.com/nestjs/throttler#readme
    ThrottlerModule.forRoot([
      {
        ttl: minutes(5), // 5 minutes = 300s
        limit: 600, // 600 limit
        ignoreUserAgents: [/googlebot/gi, /bingbot/gi, /baidubot/gi],
        skipIf: (context) => {
          // Skip throttle for the front-end server.
          const request = context.switchToHttp().getRequest<Request>()
          // Work only for front-end applications running on the same host machine.
          return request.hostname === 'localhost' || ['127.0.0.1', '::1'].includes(request.ip)
        }
      }
    ]),
    HelperModule,
    DatabaseModule,
    CacheModule,
    ExpansionModule,
    // BIZs
    AuthModule,
    OptionModule,
    FeedbackModule,
    AnnouncementModule,
    TagModule,
    CategoryModule,
    ArticleModule,
    CommentModule,
    DisqusModule,
    ArchiveModule,
    VoteModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe
    }
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorsMiddleware, OriginMiddleware).forRoutes('*')
  }
}
