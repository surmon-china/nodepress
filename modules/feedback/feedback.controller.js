"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackController = void 0;
const trim_1 = __importDefault(require("lodash/trim"));
const isUndefined_1 = __importDefault(require("lodash/isUndefined"));
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const admin_only_guard_1 = require("../../guards/admin-only.guard");
const success_response_decorator_1 = require("../../decorators/success-response.decorator");
const request_context_decorator_1 = require("../../decorators/request-context.decorator");
const helper_service_email_1 = require("../../core/helper/helper.service.email");
const value_transformer_1 = require("../../transformers/value.transformer");
const feedback_dto_1 = require("./feedback.dto");
const feedback_model_1 = require("./feedback.model");
const feedback_service_1 = require("./feedback.service");
const APP_CONFIG = __importStar(require("../../app.config"));
let FeedbackController = class FeedbackController {
    emailService;
    feedbackService;
    constructor(emailService, feedbackService) {
        this.emailService = emailService;
        this.feedbackService = feedbackService;
    }
    getFeedbacks(query) {
        const { sort, page, per_page, ...filters } = query;
        const paginateQuery = {};
        const paginateOptions = { page, perPage: per_page, dateSort: sort };
        if (!(0, isUndefined_1.default)(filters.tid)) {
            paginateQuery.tid = filters.tid;
        }
        if (!(0, isUndefined_1.default)(filters.emotion)) {
            paginateQuery.emotion = filters.emotion;
        }
        if (!(0, isUndefined_1.default)(filters.marked)) {
            paginateQuery.marked = (0, value_transformer_1.numberToBoolean)(filters.marked);
        }
        if (filters.keyword) {
            const trimmed = (0, trim_1.default)(filters.keyword);
            const keywordRegExp = new RegExp(trimmed, 'i');
            paginateQuery.$or = [
                { content: keywordRegExp },
                { user_name: keywordRegExp },
                { user_email: keywordRegExp },
                { remark: keywordRegExp }
            ];
        }
        return this.feedbackService.paginate(paginateQuery, paginateOptions);
    }
    async createFeedback(feedback, { visitor }) {
        const created = await this.feedbackService.create(feedback, visitor);
        const subject = `You have a new feedback`;
        const texts = [
            `${subject} on ${created.tid}.`,
            `Author: ${created.user_name || 'Anonymous user'}`,
            `Emotion: ${created.emotion_emoji} ${created.emotion_text} (${created.emotion})`,
            `Feedback: ${created.content}`
        ];
        this.emailService.sendMailAs(APP_CONFIG.APP_BIZ.FE_NAME, {
            to: APP_CONFIG.APP_BIZ.ADMIN_EMAIL,
            subject,
            text: texts.join('\n'),
            html: texts.map((text) => `<p>${text}</p>`).join('\n')
        });
        return created;
    }
    deleteFeedbacks(body) {
        return this.feedbackService.batchDelete(body.feedback_ids);
    }
    putFeedback({ params }, feedback) {
        return this.feedbackService.update(params.id, feedback);
    }
    deleteFeedback({ params }) {
        return this.feedbackService.delete(params.id);
    }
};
exports.FeedbackController = FeedbackController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    (0, success_response_decorator_1.SuccessResponse)({ message: 'Get feedbacks succeeded', usePaginate: true }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [feedback_dto_1.FeedbackPaginateQueryDTO]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "getFeedbacks", null);
__decorate([
    (0, common_1.Post)(),
    (0, throttler_1.Throttle)({ default: { ttl: (0, throttler_1.seconds)(30), limit: 5 } }),
    (0, success_response_decorator_1.SuccessResponse)('Create feedback succeeded'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, request_context_decorator_1.RequestContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [feedback_model_1.FeedbackBase, Object]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "createFeedback", null);
__decorate([
    (0, common_1.Delete)(),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    (0, success_response_decorator_1.SuccessResponse)('Delete feedbacks succeeded'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [feedback_dto_1.FeedbacksDTO]),
    __metadata("design:returntype", void 0)
], FeedbackController.prototype, "deleteFeedbacks", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    (0, success_response_decorator_1.SuccessResponse)('Update feedback succeeded'),
    __param(0, (0, request_context_decorator_1.RequestContext)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, feedback_model_1.Feedback]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "putFeedback", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    (0, success_response_decorator_1.SuccessResponse)('Delete feedback succeeded'),
    __param(0, (0, request_context_decorator_1.RequestContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FeedbackController.prototype, "deleteFeedback", null);
exports.FeedbackController = FeedbackController = __decorate([
    (0, common_1.Controller)('feedback'),
    __metadata("design:paramtypes", [helper_service_email_1.EmailService,
        feedback_service_1.FeedbackService])
], FeedbackController);
//# sourceMappingURL=feedback.controller.js.map