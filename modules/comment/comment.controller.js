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
const lodash_1 = __importDefault(require("lodash"));
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../../guards/auth.guard");
const humanized_auth_guard_1 = require("../../guards/humanized-auth.guard");
const http_decorator_1 = require("../../decorators/http.decorator");
const query_params_decorator_1 = require("../../decorators/query-params.decorator");
const biz_interface_1 = require("../../interfaces/biz.interface");
const comment_service_1 = require("./comment.service");
const comment_model_1 = require("./comment.model");
let CommentController = class CommentController {
    constructor(commentService) {
        this.commentService = commentService;
    }
    getComments({ querys, options, origin, isAuthenticated }) {
        if (Number(origin.sort) === biz_interface_1.SortType.Hot) {
            options.sort = { likes: biz_interface_1.SortType.Desc };
        }
        const keyword = lodash_1.default.trim(origin.keyword);
        if (keyword) {
            const keywordRegExp = new RegExp(keyword, 'i');
            querys.$or = [{ content: keywordRegExp }, { 'author.name': keywordRegExp }, { 'author.email': keywordRegExp }];
        }
        return this.commentService.paginater(querys, options, !isAuthenticated);
    }
    createComment(comment, { visitor }) {
        return this.commentService.createFormClient(comment, visitor);
    }
    patchComments({ visitor }, body) {
        return this.commentService.batchPatchState(body, visitor.referer);
    }
    delComments(body) {
        return this.commentService.batchDelete(body.comment_ids, body.post_ids);
    }
    getComment({ params }) {
        return this.commentService.getDetailByNumberID(params.id).then((comment) => {
            return comment ? comment : Promise.reject('Comment not found');
        });
    }
    putComment({ params, visitor }, comment) {
        return this.commentService.update(params.id, comment, visitor.referer);
    }
    delComment({ params }) {
        return this.commentService.delete(params.id);
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(humanized_auth_guard_1.HumanizedJwtAuthGuard),
    http_decorator_1.HttpProcessor.paginate(),
    http_decorator_1.HttpProcessor.handle('Get comment list'),
    __param(0, (0, query_params_decorator_1.QueryParams)([query_params_decorator_1.QueryParamsField.State, query_params_decorator_1.QueryParamsField.CommentState, 'post_id'])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "getComments", null);
__decorate([
    (0, common_1.Post)(),
    http_decorator_1.HttpProcessor.handle('Create comment'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, query_params_decorator_1.QueryParams)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [comment_model_1.CreateCommentBase, Object]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "createComment", null);
__decorate([
    (0, common_1.Patch)(),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    http_decorator_1.HttpProcessor.handle('Update comments'),
    __param(0, (0, query_params_decorator_1.QueryParams)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, comment_model_1.CommentsStatePayload]),
    __metadata("design:returntype", void 0)
], CommentController.prototype, "patchComments", null);
__decorate([
    (0, common_1.Delete)(),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    http_decorator_1.HttpProcessor.handle('Delete comments'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [comment_model_1.CommentsPayload]),
    __metadata("design:returntype", void 0)
], CommentController.prototype, "delComments", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    http_decorator_1.HttpProcessor.handle({ message: 'Get comment detail', error: common_1.HttpStatus.NOT_FOUND }),
    __param(0, (0, query_params_decorator_1.QueryParams)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "getComment", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    http_decorator_1.HttpProcessor.handle('Update comment'),
    __param(0, (0, query_params_decorator_1.QueryParams)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, comment_model_1.Comment]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "putComment", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    http_decorator_1.HttpProcessor.handle('Delete comment'),
    __param(0, (0, query_params_decorator_1.QueryParams)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CommentController.prototype, "delComment", null);
CommentController = __decorate([
    (0, common_1.Controller)('comment'),
    __metadata("design:paramtypes", [comment_service_1.CommentService])
], CommentController);
exports.CommentController = CommentController;
//# sourceMappingURL=comment.controller.js.map