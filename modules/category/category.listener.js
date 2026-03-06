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
exports.CategoryListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const events_constant_1 = require("../../constants/events.constant");
const category_service_1 = require("./category.service");
let CategoryListener = class CategoryListener {
    categoryService;
    constructor(categoryService) {
        this.categoryService = categoryService;
    }
    async handleAnyArticleChanged() {
        await this.categoryService.updateAllPublicCategoriesCache();
    }
};
exports.CategoryListener = CategoryListener;
__decorate([
    (0, event_emitter_1.OnEvent)(events_constant_1.GlobalEventKey.ArticleCreated, { async: true }),
    (0, event_emitter_1.OnEvent)(events_constant_1.GlobalEventKey.ArticleUpdated, { async: true }),
    (0, event_emitter_1.OnEvent)(events_constant_1.GlobalEventKey.ArticleDeleted, { async: true }),
    (0, event_emitter_1.OnEvent)(events_constant_1.GlobalEventKey.ArticlesStatusChanged, { async: true }),
    (0, event_emitter_1.OnEvent)(events_constant_1.GlobalEventKey.ArticlesDeleted, { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CategoryListener.prototype, "handleAnyArticleChanged", null);
exports.CategoryListener = CategoryListener = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [category_service_1.CategoryService])
], CategoryListener);
//# sourceMappingURL=category.listener.js.map