"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const events_constant_1 = require("../../constants/events.constant");
const article_service_1 = require("./article.service");
const article_service_sync_1 = require("./article.service.sync");
let ArticleListener = class ArticleListener {
    articleService;
    articleSyncService;
    constructor(articleService, articleSyncService) {
        this.articleService = articleService;
        this.articleSyncService = articleSyncService;
    }
    async handleRelationalDataUpdated() {
        await this.articleService.updateAllPublicArticlesCache();
    }
    async handleTagsDeleted(tagObjectIds) {
        await this.articleSyncService.removeTagsFromAllArticles(tagObjectIds);
        await this.articleService.updateAllPublicArticlesCache();
    }
    async handleCategoriesDeleted(categoryObjectIds) {
        await this.articleSyncService.removeCategoriesFromAllArticles(categoryObjectIds);
        await this.articleService.updateAllPublicArticlesCache();
    }
};
exports.ArticleListener = ArticleListener;
__decorate([
    (0, event_emitter_1.OnEvent)(events_constant_1.EventKeys.TagUpdated, { async: true }),
    (0, event_emitter_1.OnEvent)(events_constant_1.EventKeys.CategoryUpdated, { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ArticleListener.prototype, "handleRelationalDataUpdated", null);
__decorate([
    (0, event_emitter_1.OnEvent)(events_constant_1.EventKeys.TagDeleted, { async: true }),
    (0, event_emitter_1.OnEvent)(events_constant_1.EventKeys.TagsDeleted, { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ArticleListener.prototype, "handleTagsDeleted", null);
__decorate([
    (0, event_emitter_1.OnEvent)(events_constant_1.EventKeys.CategoryDeleted, { async: true }),
    (0, event_emitter_1.OnEvent)(events_constant_1.EventKeys.CategoriesDeleted, { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ArticleListener.prototype, "handleCategoriesDeleted", null);
exports.ArticleListener = ArticleListener = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [article_service_1.ArticleService,
        article_service_sync_1.ArticleSyncService])
], ArticleListener);
//# sourceMappingURL=article.listener.js.map