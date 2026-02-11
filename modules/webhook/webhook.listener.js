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
const article_model_1 = require("../article/article.model");
const webhook_service_1 = require("./webhook.service");
let WebhookListener = class WebhookListener {
    webhookService;
    constructor(webhookService) {
        this.webhookService = webhookService;
    }
    handleOptionsUpdated(payload) {
        return this.webhookService.dispatch(events_constant_1.EventKeys.OptionsUpdated, payload);
    }
    handleArticleCreated(payload) {
        return this.webhookService.dispatch(events_constant_1.EventKeys.ArticleCreated, payload);
    }
    handleArticleUpdated(payload) {
        return this.webhookService.dispatch(events_constant_1.EventKeys.ArticleUpdated, payload);
    }
    handleArticleDeleted(payload) {
        return this.webhookService.dispatch(events_constant_1.EventKeys.ArticleDeleted, payload);
    }
};
exports.WebhookListener = WebhookListener;
__decorate([
    (0, event_emitter_1.OnEvent)(events_constant_1.EventKeys.OptionsUpdated, { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [options_model_1.Option]),
    __metadata("design:returntype", void 0)
], WebhookListener.prototype, "handleOptionsUpdated", null);
__decorate([
    (0, event_emitter_1.OnEvent)(events_constant_1.EventKeys.ArticleCreated, { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [article_model_1.Article]),
    __metadata("design:returntype", void 0)
], WebhookListener.prototype, "handleArticleCreated", null);
__decorate([
    (0, event_emitter_1.OnEvent)(events_constant_1.EventKeys.ArticleUpdated, { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [article_model_1.Article]),
    __metadata("design:returntype", void 0)
], WebhookListener.prototype, "handleArticleUpdated", null);
__decorate([
    (0, event_emitter_1.OnEvent)(events_constant_1.EventKeys.ArticleDeleted, { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [article_model_1.Article]),
    __metadata("design:returntype", void 0)
], WebhookListener.prototype, "handleArticleDeleted", null);
exports.WebhookListener = WebhookListener = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [webhook_service_1.WebhookService])
], WebhookListener);
//# sourceMappingURL=webhook.listener.js.map