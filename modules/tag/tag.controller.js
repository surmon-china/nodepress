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
exports.TagController = void 0;
const trim_1 = __importDefault(require("lodash/trim"));
const common_1 = require("@nestjs/common");
const admin_only_guard_1 = require("../../guards/admin-only.guard");
const admin_optional_guard_1 = require("../../guards/admin-optional.guard");
const permission_pipe_1 = require("../../pipes/permission.pipe");
const success_response_decorator_1 = require("../../decorators/success-response.decorator");
const request_context_decorator_1 = require("../../decorators/request-context.decorator");
const tag_dto_1 = require("./tag.dto");
const tag_service_1 = require("./tag.service");
const tag_model_1 = require("./tag.model");
let TagController = class TagController {
    tagService;
    constructor(tagService) {
        this.tagService = tagService;
    }
    getTags(query, { isUnauthenticated }) {
        const { sort, page, per_page, ...filters } = query;
        const queryFilter = {};
        const paginateOptions = { page, perPage: per_page, dateSort: sort };
        if (filters.keyword) {
            const trimmed = (0, trim_1.default)(filters.keyword);
            const keywordRegExp = new RegExp(trimmed, 'i');
            queryFilter.$or = [{ name: keywordRegExp }, { slug: keywordRegExp }, { description: keywordRegExp }];
        }
        return this.tagService.paginate(queryFilter, paginateOptions, isUnauthenticated);
    }
    getAllTags({ isAuthenticated }) {
        return isAuthenticated
            ? this.tagService.getAllTags({ aggregatePublicOnly: false })
            : this.tagService.getAllTagsCache();
    }
    createTag(tag) {
        return this.tagService.create(tag);
    }
    delTags(body) {
        return this.tagService.batchDelete(body.tag_ids);
    }
    putTag({ params }, tag) {
        return this.tagService.update(params.id, tag);
    }
    delTag({ params }) {
        return this.tagService.delete(params.id);
    }
};
exports.TagController = TagController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(admin_optional_guard_1.AdminOptionalGuard),
    (0, success_response_decorator_1.SuccessResponse)({ message: 'Get tags succeeded', usePaginate: true }),
    __param(0, (0, common_1.Query)(permission_pipe_1.PermissionPipe)),
    __param(1, (0, request_context_decorator_1.RequestContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tag_dto_1.TagPaginateQueryDTO, Object]),
    __metadata("design:returntype", Promise)
], TagController.prototype, "getTags", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, common_1.UseGuards)(admin_optional_guard_1.AdminOptionalGuard),
    (0, success_response_decorator_1.SuccessResponse)('Get all tags succeeded'),
    __param(0, (0, request_context_decorator_1.RequestContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TagController.prototype, "getAllTags", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    (0, success_response_decorator_1.SuccessResponse)('Create tag succeeded'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tag_model_1.Tag]),
    __metadata("design:returntype", Promise)
], TagController.prototype, "createTag", null);
__decorate([
    (0, common_1.Delete)(),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    (0, success_response_decorator_1.SuccessResponse)('Delete tags succeeded'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tag_dto_1.TagsDTO]),
    __metadata("design:returntype", void 0)
], TagController.prototype, "delTags", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    (0, success_response_decorator_1.SuccessResponse)('Update Tag succeeded'),
    __param(0, (0, request_context_decorator_1.RequestContext)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, tag_model_1.Tag]),
    __metadata("design:returntype", Promise)
], TagController.prototype, "putTag", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    (0, success_response_decorator_1.SuccessResponse)('Delete tag succeeded'),
    __param(0, (0, request_context_decorator_1.RequestContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TagController.prototype, "delTag", null);
exports.TagController = TagController = __decorate([
    (0, common_1.Controller)('tag'),
    __metadata("design:paramtypes", [tag_service_1.TagService])
], TagController);
//# sourceMappingURL=tag.controller.js.map