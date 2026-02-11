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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiController = void 0;
const throttler_1 = require("@nestjs/throttler");
const common_1 = require("@nestjs/common");
const admin_only_guard_1 = require("../../guards/admin-only.guard");
const success_response_decorator_1 = require("../../decorators/success-response.decorator");
const comment_service_1 = require("../comment/comment.service");
const ai_dto_1 = require("./ai.dto");
const ai_config_1 = require("./ai.config");
const ai_service_1 = require("./ai.service");
const extras_constant_1 = require("../../constants/extras.constant");
let AiController = class AiController {
    aiService;
    commentService;
    constructor(aiService, commentService) {
        this.aiService = aiService;
        this.commentService = commentService;
    }
    getAiConfig() {
        return {
            models: ai_config_1.AiModelsList,
            prompts: ai_config_1.DEFAULT_AI_PROMPT_TEMPLATES,
            extra_keys: {
                article_summary: extras_constant_1.ArticleAiSummaryExtraKeys,
                article_review: extras_constant_1.ArticleAiReviewExtraKeys,
                comment_generation: extras_constant_1.CommentAiGenerationExtraKeys
            }
        };
    }
    generateArticleSummary(payload) {
        return this.aiService.generateArticleSummary(payload);
    }
    generateArticleReview(payload) {
        return this.aiService.generateArticleReview(payload);
    }
    async generateCommentReply(payload) {
        const comment = await this.commentService.getDetailByNumberId(payload.comment_id);
        return this.aiService.generateCommentReply(comment, payload);
    }
};
exports.AiController = AiController;
__decorate([
    (0, common_1.Get)('config'),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    (0, success_response_decorator_1.SuccessResponse)('Get AI config succeeded'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AiController.prototype, "getAiConfig", null);
__decorate([
    (0, common_1.Post)('generate-article-summary'),
    (0, throttler_1.Throttle)({ default: { ttl: (0, throttler_1.minutes)(10), limit: 50 } }),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    (0, success_response_decorator_1.SuccessResponse)('Generate article summary succeeded'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ai_dto_1.GenerateAiArticleContentDTO]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "generateArticleSummary", null);
__decorate([
    (0, common_1.Post)('generate-article-review'),
    (0, throttler_1.Throttle)({ default: { ttl: (0, throttler_1.minutes)(10), limit: 50 } }),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    (0, success_response_decorator_1.SuccessResponse)('Generate article review succeeded'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ai_dto_1.GenerateAiArticleContentDTO]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "generateArticleReview", null);
__decorate([
    (0, common_1.Post)('generate-comment-reply'),
    (0, throttler_1.Throttle)({ default: { ttl: (0, throttler_1.minutes)(10), limit: 50 } }),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    (0, success_response_decorator_1.SuccessResponse)('Generate comment reply succeeded'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ai_dto_1.GenerateAiCommentReplyDTO]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "generateCommentReply", null);
exports.AiController = AiController = __decorate([
    (0, common_1.Controller)('ai'),
    __metadata("design:paramtypes", [ai_service_1.AiService,
        comment_service_1.CommentService])
], AiController);
//# sourceMappingURL=ai.controller.js.map