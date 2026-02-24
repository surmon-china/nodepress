"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentModule = void 0;
const common_1 = require("@nestjs/common");
const options_module_1 = require("../options/options.module");
const article_module_1 = require("../article/article.module");
const user_module_1 = require("../user/user.module");
const comment_controller_1 = require("./comment.controller");
const comment_model_1 = require("./comment.model");
const comment_service_akismet_1 = require("./comment.service.akismet");
const comment_service_blocklist_1 = require("./comment.service.blocklist");
const comment_service_effect_1 = require("./comment.service.effect");
const comment_service_stats_1 = require("./comment.service.stats");
const comment_service_1 = require("./comment.service");
const comment_listener_1 = require("./comment.listener");
let CommentModule = class CommentModule {
};
exports.CommentModule = CommentModule;
exports.CommentModule = CommentModule = __decorate([
    (0, common_1.Module)({
        imports: [options_module_1.OptionsModule, article_module_1.ArticleModule, user_module_1.UserModule],
        controllers: [comment_controller_1.CommentController],
        providers: [
            comment_model_1.CommentProvider,
            comment_service_akismet_1.CommentAkismetService,
            comment_service_blocklist_1.CommentBlocklistService,
            comment_service_effect_1.CommentEffectService,
            comment_service_stats_1.CommentStatsService,
            comment_service_1.CommentService,
            comment_listener_1.CommentListener
        ],
        exports: [comment_service_1.CommentService, comment_service_stats_1.CommentStatsService]
    })
], CommentModule);
//# sourceMappingURL=comment.module.js.map