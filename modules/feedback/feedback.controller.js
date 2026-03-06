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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackController = void 0;
const isUndefined_1 = __importDefault(require("lodash/isUndefined"));
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const throttler_1 = require("@nestjs/throttler");
const success_response_decorator_1 = require("../../decorators/success-response.decorator");
const only_identity_decorator_1 = require("../../decorators/only-identity.decorator");
const request_context_decorator_1 = require("../../decorators/request-context.decorator");
const user_service_1 = require("../user/user.service");
const events_constant_1 = require("../../constants/events.constant");
const feedback_dto_1 = require("./feedback.dto");
const feedback_service_1 = require("./feedback.service");
let FeedbackController = class FeedbackController {
    eventEmitter;
    userService;
    feedbackService;
    constructor(eventEmitter, userService, feedbackService) {
        this.eventEmitter = eventEmitter;
        this.userService = userService;
        this.feedbackService = feedbackService;
    }
    async createFeedback(dto, { visitor, identity }) {
        const user = identity.isUser ? await this.userService.findOne(identity.payload.uid) : void 0;
        const created = await this.feedbackService.create(dto, visitor, user);
        this.eventEmitter.emit(events_constant_1.GlobalEventKey.FeedbackCreated, created.toObject());
        return created;
    }
    getFeedbacks(query) {
        const { sort, page, per_page, ...filters } = query;
        const queryFilter = {};
        const paginateOptions = { page, perPage: per_page, dateSort: sort };
        if (!(0, isUndefined_1.default)(filters.emotion)) {
            queryFilter.emotion = filters.emotion;
        }
        if (!(0, isUndefined_1.default)(filters.marked)) {
            queryFilter.marked = filters.marked;
        }
        if (!(0, isUndefined_1.default)(filters.author_type)) {
            queryFilter.author_type = filters.author_type;
        }
        if (filters.keyword) {
            queryFilter.$or = [
                { content: { $regex: filters.keyword, $options: 'i' } },
                { author_name: { $regex: filters.keyword, $options: 'i' } },
                { author_email: { $regex: filters.keyword, $options: 'i' } },
                { remark: { $regex: filters.keyword, $options: 'i' } }
            ];
        }
        return this.feedbackService.paginate(queryFilter, {
            ...paginateOptions,
            populate: 'user'
        });
    }
    deleteFeedbacks({ feedback_ids }) {
        return this.feedbackService.batchDelete(feedback_ids);
    }
    updateFeedback(id, dto) {
        return this.feedbackService.update(id, dto);
    }
    deleteFeedback(id) {
        return this.feedbackService.delete(id);
    }
};
exports.FeedbackController = FeedbackController;
__decorate([
    (0, common_1.Post)(),
    (0, throttler_1.Throttle)({ default: { ttl: (0, throttler_1.seconds)(30), limit: 5 } }),
    (0, success_response_decorator_1.SuccessResponse)('Create feedback succeeded'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, request_context_decorator_1.RequestContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [feedback_dto_1.CreateFeedbackDto, Object]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "createFeedback", null);
__decorate([
    (0, common_1.Get)(),
    (0, only_identity_decorator_1.OnlyIdentity)(only_identity_decorator_1.IdentityRole.Admin),
    (0, success_response_decorator_1.SuccessResponse)({ message: 'Get feedback entries succeeded', usePaginate: true }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [feedback_dto_1.FeedbackPaginateQueryDto]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "getFeedbacks", null);
__decorate([
    (0, common_1.Delete)(),
    (0, only_identity_decorator_1.OnlyIdentity)(only_identity_decorator_1.IdentityRole.Admin),
    (0, success_response_decorator_1.SuccessResponse)('Delete feedback entries succeeded'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [feedback_dto_1.FeedbackIdsDto]),
    __metadata("design:returntype", void 0)
], FeedbackController.prototype, "deleteFeedbacks", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, only_identity_decorator_1.OnlyIdentity)(only_identity_decorator_1.IdentityRole.Admin),
    (0, success_response_decorator_1.SuccessResponse)('Update feedback succeeded'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, feedback_dto_1.UpdateFeedbackDto]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "updateFeedback", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, only_identity_decorator_1.OnlyIdentity)(only_identity_decorator_1.IdentityRole.Admin),
    (0, success_response_decorator_1.SuccessResponse)('Delete feedback succeeded'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "deleteFeedback", null);
exports.FeedbackController = FeedbackController = __decorate([
    (0, common_1.Controller)('feedback'),
    __metadata("design:paramtypes", [event_emitter_1.EventEmitter2,
        user_service_1.UserService,
        feedback_service_1.FeedbackService])
], FeedbackController);
//# sourceMappingURL=feedback.controller.js.map