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
exports.WebhookListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const events_constant_1 = require("../../constants/events.constant");
const options_model_1 = require("../options/options.model");
const article_constant_1 = require("../article/article.constant");
const article_service_1 = require("../article/article.service");
const webhook_service_1 = require("./webhook.service");
const webhook_constant_1 = require("./webhook.constant");
let WebhookListener = class WebhookListener {
    webhookService;
    articleService;
    constructor(webhookService, articleService) {
        this.webhookService = webhookService;
        this.articleService = articleService;
    }
    async handleOptionsUpdated(options) {
        await this.webhookService.dispatch(webhook_constant_1.WebhookEvent.UpsertOptions, options);
    }
    async handleArticleUpsert(article) {
        if (article.status === article_constant_1.ArticleStatus.Published) {
            await this.webhookService.dispatch(webhook_constant_1.WebhookEvent.UpsertArticles, [article]);
        }
        else {
            await this.webhookService.dispatch(webhook_constant_1.WebhookEvent.DeleteArticles, [article.id]);
        }
    }
    async handleArticlesStatusChange(payload) {
        if (payload.status === article_constant_1.ArticleStatus.Published) {
            const articles = await this.articleService.getListByIds(payload.articleIds);
            await this.webhookService.dispatch(webhook_constant_1.WebhookEvent.UpsertArticles, articles);
        }
        else {
            await this.webhookService.dispatch(webhook_constant_1.WebhookEvent.DeleteArticles, payload.articleIds);
        }
    }
    async handleArticleDeleted(articleId) {
        await this.webhookService.dispatch(webhook_constant_1.WebhookEvent.DeleteArticles, [articleId]);
    }
    async handleArticlesDeleted(articleIds) {
        await this.webhookService.dispatch(webhook_constant_1.WebhookEvent.DeleteArticles, articleIds);
    }
};
exports.WebhookListener = WebhookListener;
__decorate([
    (0, event_emitter_1.OnEvent)(events_constant_1.EventKeys.OptionsUpdated, { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [options_model_1.Option]),
    __metadata("design:returntype", Promise)
], WebhookListener.prototype, "handleOptionsUpdated", null);
__decorate([
    (0, event_emitter_1.OnEvent)(events_constant_1.EventKeys.ArticleCreated, { async: true }),
    (0, event_emitter_1.OnEvent)(events_constant_1.EventKeys.ArticleUpdated, { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WebhookListener.prototype, "handleArticleUpsert", null);
__decorate([
    (0, event_emitter_1.OnEvent)(events_constant_1.EventKeys.ArticlesStatusChanged, { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WebhookListener.prototype, "handleArticlesStatusChange", null);
__decorate([
    (0, event_emitter_1.OnEvent)(events_constant_1.EventKeys.ArticleDeleted, { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], WebhookListener.prototype, "handleArticleDeleted", null);
__decorate([
    (0, event_emitter_1.OnEvent)(events_constant_1.EventKeys.ArticlesDeleted, { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], WebhookListener.prototype, "handleArticlesDeleted", null);
exports.WebhookListener = WebhookListener = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [webhook_service_1.WebhookService,
        article_service_1.ArticleService])
], WebhookListener);
//# sourceMappingURL=webhook.listener.js.map