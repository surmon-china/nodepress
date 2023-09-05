"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const app_controller_1 = require("./app.controller");
const cache_interceptor_1 = require("./interceptors/cache.interceptor");
const validation_pipe_1 = require("./pipes/validation.pipe");
const cors_middleware_1 = require("./middlewares/cors.middleware");
const origin_middleware_1 = require("./middlewares/origin.middleware");
const database_module_1 = require("./processors/database/database.module");
const cache_module_1 = require("./processors/cache/cache.module");
const helper_module_1 = require("./processors/helper/helper.module");
const expansion_module_1 = require("./modules/expansion/expansion.module");
const auth_module_1 = require("./modules/auth/auth.module");
const option_module_1 = require("./modules/option/option.module");
const feedback_module_1 = require("./modules/feedback/feedback.module");
const announcement_module_1 = require("./modules/announcement/announcement.module");
const tag_module_1 = require("./modules/tag/tag.module");
const category_module_1 = require("./modules/category/category.module");
const article_module_1 = require("./modules/article/article.module");
const comment_module_1 = require("./modules/comment/comment.module");
const disqus_module_1 = require("./modules/disqus/disqus.module");
const archive_module_1 = require("./modules/archive/archive.module");
const vote_module_1 = require("./modules/vote/vote.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(cors_middleware_1.CorsMiddleware, origin_middleware_1.OriginMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: (0, throttler_1.minutes)(5),
                    limit: 300,
                    ignoreUserAgents: [/googlebot/gi, /bingbot/gi, /baidubot/gi]
                }
            ]),
            helper_module_1.HelperModule,
            database_module_1.DatabaseModule,
            cache_module_1.CacheModule,
            expansion_module_1.ExpansionModule,
            auth_module_1.AuthModule,
            option_module_1.OptionModule,
            feedback_module_1.FeedbackModule,
            announcement_module_1.AnnouncementModule,
            tag_module_1.TagModule,
            category_module_1.CategoryModule,
            article_module_1.ArticleModule,
            comment_module_1.CommentModule,
            disqus_module_1.DisqusModule,
            archive_module_1.ArchiveModule,
            vote_module_1.VoteModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: cache_interceptor_1.CacheInterceptor
            },
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard
            },
            {
                provide: core_1.APP_PIPE,
                useClass: validation_pipe_1.ValidationPipe
            }
        ]
    })
], AppModule);
//# sourceMappingURL=app.module.js.map