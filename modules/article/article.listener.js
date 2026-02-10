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
const helper_service_counter_1 = require("../../core/helper/helper.service.counter");
const events_constant_1 = require("../../constants/events.constant");
const cache_constant_1 = require("../../constants/cache.constant");
let ArticleListener = class ArticleListener {
    counterService;
    constructor(counterService) {
        this.counterService = counterService;
    }
    async handleArticleViewed(articleId) {
        this.counterService.incrementGlobalCount(cache_constant_1.CacheKeys.TodayViewCount);
    }
};
exports.ArticleListener = ArticleListener;
__decorate([
    (0, event_emitter_1.OnEvent)(events_constant_1.EventKeys.ArticleViewed, { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ArticleListener.prototype, "handleArticleViewed", null);
exports.ArticleListener = ArticleListener = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [helper_service_counter_1.CounterService])
], ArticleListener);
//# sourceMappingURL=article.listener.js.map