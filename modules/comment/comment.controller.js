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
exports.CommentController = void 0;
const lodash_1 = __importDefault(require("lodash"));
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const admin_only_guard_1 = require("../../guards/admin-only.guard");
const admin_maybe_guard_1 = require("../../guards/admin-maybe.guard");
const permission_pipe_1 = require("../../pipes/permission.pipe");
const expose_pipe_1 = require("../../pipes/expose.pipe");
const biz_interface_1 = require("../../interfaces/biz.interface");
const responsor_decorator_1 = require("../../decorators/responsor.decorator");
const queryparams_decorator_1 = require("../../decorators/queryparams.decorator");
const comment_dto_1 = require("./comment.dto");
const comment_service_1 = require("./comment.service");
const comment_model_1 = require("./comment.model");
let CommentController = class CommentController {
    constructor(commentService) {
        this.commentService = commentService;
    }
    getComments(query, { isUnauthenticated }) {
        const { sort, page, per_page } = query, filters = __rest(query, ["sort", "page", "per_page"]);
        const paginateQuery = {};
        const paginateOptions = { page, perPage: per_page };
        if (!lodash_1.default.isUndefined(sort)) {
            if (sort === biz_interface_1.SortType.Hottest) {
                paginateOptions.sort = { likes: biz_interface_1.SortType.Desc };
            }
            else {
                paginateOptions.dateSort = sort;
            }
        }
        if (!lodash_1.default.isUndefined(filters.state)) {
            paginateQuery.state = filters.state;
        }
        if (!lodash_1.default.isUndefined(filters.post_id)) {
            paginateQuery.post_id = filters.post_id;
        }
        if (filters.keyword) {
            const trimmed = lodash_1.default.trim(filters.keyword);
            const keywordRegExp = new RegExp(trimmed, 'i');
            paginateQuery.$or = [
                { content: keywordRegExp },
                { 'author.name': keywordRegExp },
                { 'author.email': keywordRegExp },
            ];
        }
        return this.commentService.paginater(paginateQuery, paginateOptions, isUnauthenticated);
    }
    createComment(comment, { visitor }) {
        return comment.author.email
            ? this.commentService.createFormClient(comment, visitor)
            : Promise.reject(`author email should not be empty`);
    }
    patchComments({ visitor }, body) {
        return this.commentService.batchPatchState(body, visitor.referer);
    }
    delComments(body) {
        return this.commentService.batchDelete(body.comment_ids, body.post_ids);
    }
    getComment({ params }) {
        return this.commentService.getDetailByObjectID(params.id).then((comment) => {
            return comment ? comment : Promise.reject('Comment not found');
        });
    }
    putComment({ params, visitor }, comment) {
        return this.commentService.update(params.id, comment, visitor.referer);
    }
    putCommentIPLocation({ params }) {
        return this.commentService.reviseIPLocation(params.id);
    }
    delComment({ params }) {
        return this.commentService.delete(params.id);
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(admin_maybe_guard_1.AdminMaybeGuard),
    responsor_decorator_1.Responsor.paginate(),
    responsor_decorator_1.Responsor.handle('Get comments'),
    __param(0, (0, common_1.Query)(permission_pipe_1.PermissionPipe, expose_pipe_1.ExposePipe)),
    __param(1, (0, queryparams_decorator_1.QueryParams)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [comment_dto_1.CommentPaginateQueryDTO, Object]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "getComments", null);
__decorate([
    (0, throttler_1.Throttle)(6, 30),
    (0, common_1.Post)(),
    responsor_decorator_1.Responsor.handle('Create comment'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, queryparams_decorator_1.QueryParams)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [comment_model_1.CommentBase, Object]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "createComment", null);
__decorate([
    (0, common_1.Patch)(),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    responsor_decorator_1.Responsor.handle('Update comments'),
    __param(0, (0, queryparams_decorator_1.QueryParams)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, comment_dto_1.CommentsStateDTO]),
    __metadata("design:returntype", void 0)
], CommentController.prototype, "patchComments", null);
__decorate([
    (0, common_1.Delete)(),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    responsor_decorator_1.Responsor.handle('Delete comments'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [comment_dto_1.CommentsDTO]),
    __metadata("design:returntype", void 0)
], CommentController.prototype, "delComments", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    responsor_decorator_1.Responsor.handle({ message: 'Get comment detail', error: common_1.HttpStatus.NOT_FOUND }),
    __param(0, (0, queryparams_decorator_1.QueryParams)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "getComment", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    responsor_decorator_1.Responsor.handle('Update comment'),
    __param(0, (0, queryparams_decorator_1.QueryParams)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, comment_model_1.Comment]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "putComment", null);
__decorate([
    (0, common_1.Put)(':id/ip_location'),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    responsor_decorator_1.Responsor.handle('Update comment IP location'),
    __param(0, (0, queryparams_decorator_1.QueryParams)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CommentController.prototype, "putCommentIPLocation", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    responsor_decorator_1.Responsor.handle('Delete comment'),
    __param(0, (0, queryparams_decorator_1.QueryParams)()),
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