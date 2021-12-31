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
const app_controller_1 = require("./app.controller");
const cache_interceptor_1 = require("./interceptors/cache.interceptor");
const cors_middleware_1 = require("./middlewares/cors.middleware");
const origin_middleware_1 = require("./middlewares/origin.middleware");
const database_module_1 = require("./processors/database/database.module");
const cache_module_1 = require("./processors/cache/cache.module");
const helper_module_1 = require("./processors/helper/helper.module");
const expansion_module_1 = require("./modules/expansion/expansion.module");
const auth_module_1 = require("./modules/auth/auth.module");
const option_module_1 = require("./modules/option/option.module");
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
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            helper_module_1.HelperModule,
            database_module_1.DatabaseModule,
            cache_module_1.CacheModule,
            expansion_module_1.ExpansionModule,
            auth_module_1.AuthModule,
            option_module_1.OptionModule,
            announcement_module_1.AnnouncementModule,
            tag_module_1.TagModule,
            category_module_1.CategoryModule,
            article_module_1.ArticleModule,
            comment_module_1.CommentModule,
            disqus_module_1.DisqusModule,
            archive_module_1.ArchiveModule,
            vote_module_1.VoteModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: cache_interceptor_1.HttpCacheInterceptor,
            },
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map