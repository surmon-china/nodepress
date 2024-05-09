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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackController = void 0;
const lodash_1 = __importDefault(require("lodash"));
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const admin_only_guard_1 = require("../../guards/admin-only.guard");
const expose_pipe_1 = require("../../pipes/expose.pipe");
const responser_decorator_1 = require("../../decorators/responser.decorator");
const queryparams_decorator_1 = require("../../decorators/queryparams.decorator");
const helper_service_email_1 = require("../../processors/helper/helper.service.email");
const value_transformer_1 = require("../../transformers/value.transformer");
const feedback_dto_1 = require("./feedback.dto");
const feedback_model_1 = require("./feedback.model");
const feedback_service_1 = require("./feedback.service");
const APP_CONFIG = __importStar(require("../../app.config"));
let FeedbackController = class FeedbackController {
    constructor(emailService, feedbackService) {
        this.emailService = emailService;
        this.feedbackService = feedbackService;
    }
    getFeedbacks(query) {
        const { sort, page, per_page } = query, filters = __rest(query, ["sort", "page", "per_page"]);
        const paginateQuery = {};
        const paginateOptions = { page, perPage: per_page, dateSort: sort };
        if (!lodash_1.default.isUndefined(filters.tid)) {
            paginateQuery.tid = filters.tid;
        }
        if (!lodash_1.default.isUndefined(filters.emotion)) {
            paginateQuery.emotion = filters.emotion;
        }
        if (!lodash_1.default.isUndefined(filters.marked)) {
            paginateQuery.marked = (0, value_transformer_1.numberToBoolean)(filters.marked);
        }
        if (filters.keyword) {
            const trimmed = lodash_1.default.trim(filters.keyword);
            const keywordRegExp = new RegExp(trimmed, 'i');
            paginateQuery.$or = [
                { content: keywordRegExp },
                { user_name: keywordRegExp },
                { user_email: keywordRegExp },
                { remark: keywordRegExp }
            ];
        }
        return this.feedbackService.paginator(paginateQuery, paginateOptions);
    }
    async createFeedback(feedback, { visitor }) {
        const result = await this.feedbackService.create(feedback, visitor);
        const subject = `You have a new feedback`;
        const texts = [
            `${subject} on ${result.tid}.`,
            `Author: ${result.user_name || 'Anonymous user'}`,
            `Emotion: ${result.emotion_emoji} ${result.emotion_text} (${result.emotion})`,
            `Feedback: ${result.content}`
        ];
        this.emailService.sendMailAs(APP_CONFIG.APP.FE_NAME, {
            to: APP_CONFIG.APP.ADMIN_EMAIL,
            subject,
            text: texts.join('\n'),
            html: texts.map((text) => `<p>${text}</p>`).join('\n')
        });
        return result;
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
    responser_decorator_1.Responser.paginate(),
    responser_decorator_1.Responser.handle('Get feedbacks'),
    __param(0, (0, common_1.Query)(expose_pipe_1.ExposePipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [feedback_dto_1.FeedbackPaginateQueryDTO]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "getFeedbacks", null);
__decorate([
    (0, common_1.Post)(),
    (0, throttler_1.Throttle)({ default: { ttl: (0, throttler_1.seconds)(30), limit: 5 } }),
    responser_decorator_1.Responser.handle('Create feedback'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, queryparams_decorator_1.QueryParams)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [feedback_model_1.FeedbackBase, Object]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "createFeedback", null);
__decorate([
    (0, common_1.Delete)(),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    responser_decorator_1.Responser.handle('Delete feedbacks'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [feedback_dto_1.FeedbacksDTO]),
    __metadata("design:returntype", void 0)
], FeedbackController.prototype, "deleteFeedbacks", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    responser_decorator_1.Responser.handle('Update feedback'),
    __param(0, (0, queryparams_decorator_1.QueryParams)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, feedback_model_1.Feedback]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "putFeedback", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    responser_decorator_1.Responser.handle('Delete feedback'),
    __param(0, (0, queryparams_decorator_1.QueryParams)()),
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