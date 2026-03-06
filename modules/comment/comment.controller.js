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
exports.CommentController = void 0;
const isUndefined_1 = __importDefault(require("lodash/isUndefined"));
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const event_emitter_1 = require("@nestjs/event-emitter");
const user_service_1 = require("../user/user.service");
const user_model_1 = require("../user/user.model");
const only_identity_decorator_1 = require("../../decorators/only-identity.decorator");
const request_context_decorator_1 = require("../../decorators/request-context.decorator");
const success_response_decorator_1 = require("../../decorators/success-response.decorator");
const permission_pipe_1 = require("../../pipes/permission.pipe");
const events_constant_1 = require("../../constants/events.constant");
const sort_constant_1 = require("../../constants/sort.constant");
const comment_dto_1 = require("./comment.dto");
const comment_dto_2 = require("./comment.dto");
const comment_dto_3 = require("./comment.dto");
const comment_service_stats_1 = require("./comment.service.stats");
const comment_service_1 = require("./comment.service");
let CommentController = class CommentController {
    eventEmitter;
    commentStatsService;
    commentService;
    userService;
    constructor(eventEmitter, commentStatsService, commentService, userService) {
        this.eventEmitter = eventEmitter;
        this.commentStatsService = commentStatsService;
        this.commentService = commentService;
        this.userService = userService;
    }
    async createComment({ visitor, identity }, input) {
        try {
            if (identity.isUser) {
                const user = await this.userService.findOne(identity.payload.uid);
                const userComment = this.commentService.normalize(input, { visitor, user });
                return await this.commentService.validateAndCreate(userComment, visitor.referer ?? void 0);
            }
            const guestComment = this.commentService.normalize(input, { visitor });
            if (!guestComment.author_name || !guestComment.author_email) {
                throw new common_2.BadRequestException('Author name and email are required');
            }
            return await this.commentService.validateAndCreate(guestComment, visitor.referer ?? void 0);
        }
        catch (error) {
            this.eventEmitter.emit(events_constant_1.GlobalEventKey.CommentCreateFailed, { input, visitor, error });
            throw error;
        }
    }
    async getComments(query, { identity }) {
        const { sort, page, per_page, ...filters } = query;
        const queryFilter = {};
        const paginateOptions = { page, perPage: per_page };
        if (!(0, isUndefined_1.default)(sort)) {
            if (sort === sort_constant_1.SortMode.Hottest) {
                paginateOptions.sort = { likes: sort_constant_1.SortOrder.Desc };
            }
            else {
                paginateOptions.dateSort = sort;
            }
        }
        if (!(0, isUndefined_1.default)(filters.status)) {
            queryFilter.status = filters.status;
        }
        if (!(0, isUndefined_1.default)(filters.target_type)) {
            queryFilter.target_type = filters.target_type;
        }
        if (!(0, isUndefined_1.default)(filters.target_id)) {
            queryFilter.target_id = filters.target_id;
        }
        if (!(0, isUndefined_1.default)(filters.author_type)) {
            queryFilter.author_type = filters.author_type;
        }
        if (filters.keyword) {
            queryFilter.$or = [
                { content: { $regex: filters.keyword, $options: 'i' } },
                { author_name: { $regex: filters.keyword, $options: 'i' } },
                { author_email: { $regex: filters.keyword, $options: 'i' } }
            ];
        }
        if (identity.isAdmin) {
            return await this.commentService.paginate(queryFilter, {
                ...paginateOptions,
                populate: 'user'
            });
        }
        const result = await this.commentService.paginate(queryFilter, {
            ...paginateOptions,
            populate: { path: 'user', select: user_model_1.USER_PUBLIC_POPULATE_SELECT }
        });
        const publicParentSet = await this.commentService.getPublicCommentIdSet(result.documents.map((comment) => comment.parent_id).filter((id) => id != null));
        return {
            ...result,
            documents: result.documents.map((document) => {
                document.orphaned = document.parent_id != null && !publicParentSet.has(document.parent_id);
                Reflect.deleteProperty(document, 'ip');
                Reflect.deleteProperty(document, 'author_email');
                return document;
            })
        };
    }
    getCommentsCalendar(query, { identity }) {
        return this.commentStatsService.getCalendar(!identity.isAdmin, query.timezone);
    }
    async claimComments(dto) {
        const user = await this.userService.findOne(dto.user_id);
        return await this.commentService.claimCommentsUser(dto.comment_ids, user._id);
    }
    updateCommentsStatus(dto) {
        return this.commentService.batchUpdateStatus(dto.comment_ids, dto.status);
    }
    deleteComments({ comment_ids }) {
        return this.commentService.batchDelete(comment_ids);
    }
    getComment(id) {
        return this.commentService.getDetail(id);
    }
    updateComment(id, dto) {
        return this.commentService.update(id, dto);
    }
    deleteComment(id) {
        return this.commentService.delete(id);
    }
};
exports.CommentController = CommentController;
__decorate([
    (0, common_1.Post)(),
    (0, throttler_1.Throttle)({ default: { ttl: (0, throttler_1.seconds)(30), limit: 6 } }),
    (0, success_response_decorator_1.SuccessResponse)('Create comment succeeded'),
    __param(0, (0, request_context_decorator_1.RequestContext)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, comment_dto_2.CreateCommentDto]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "createComment", null);
__decorate([
    (0, common_1.Get)(),
    (0, success_response_decorator_1.SuccessResponse)({ message: 'Get comments succeeded', usePaginate: true }),
    __param(0, (0, common_1.Query)(permission_pipe_1.PermissionPipe)),
    __param(1, (0, request_context_decorator_1.RequestContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [comment_dto_1.CommentPaginateQueryDto, Object]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "getComments", null);
__decorate([
    (0, common_1.Get)('calendar'),
    (0, success_response_decorator_1.SuccessResponse)('Get comments calendar succeeded'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, request_context_decorator_1.RequestContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [comment_dto_1.CommentCalendarQueryDto, Object]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "getCommentsCalendar", null);
__decorate([
    (0, common_1.Patch)('claim'),
    (0, only_identity_decorator_1.OnlyIdentity)(only_identity_decorator_1.IdentityRole.Admin),
    (0, success_response_decorator_1.SuccessResponse)('Claim comments succeeded'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [comment_dto_3.ClaimCommentsDto]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "claimComments", null);
__decorate([
    (0, common_1.Patch)('status'),
    (0, only_identity_decorator_1.OnlyIdentity)(only_identity_decorator_1.IdentityRole.Admin),
    (0, success_response_decorator_1.SuccessResponse)('Update comments status succeeded'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [comment_dto_3.CommentIdsStatusDto]),
    __metadata("design:returntype", void 0)
], CommentController.prototype, "updateCommentsStatus", null);
__decorate([
    (0, common_1.Delete)(),
    (0, only_identity_decorator_1.OnlyIdentity)(only_identity_decorator_1.IdentityRole.Admin),
    (0, success_response_decorator_1.SuccessResponse)('Delete comments succeeded'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [comment_dto_2.CommentIdsDto]),
    __metadata("design:returntype", void 0)
], CommentController.prototype, "deleteComments", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, only_identity_decorator_1.OnlyIdentity)(only_identity_decorator_1.IdentityRole.Admin),
    (0, success_response_decorator_1.SuccessResponse)('Get comment detail succeeded'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "getComment", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, only_identity_decorator_1.OnlyIdentity)(only_identity_decorator_1.IdentityRole.Admin),
    (0, success_response_decorator_1.SuccessResponse)('Update comment succeeded'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, comment_dto_2.UpdateCommentDto]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "updateComment", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, only_identity_decorator_1.OnlyIdentity)(only_identity_decorator_1.IdentityRole.Admin),
    (0, success_response_decorator_1.SuccessResponse)('Delete comment succeeded'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CommentController.prototype, "deleteComment", null);
exports.CommentController = CommentController = __decorate([
    (0, common_1.Controller)('comments'),
    __metadata("design:paramtypes", [event_emitter_1.EventEmitter2,
        comment_service_stats_1.CommentStatsService,
        comment_service_1.CommentService,
        user_service_1.UserService])
], CommentController);
//# sourceMappingURL=comment.controller.js.map