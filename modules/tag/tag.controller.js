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
exports.TagController = void 0;
const common_1 = require("@nestjs/common");
const only_identity_decorator_1 = require("../../decorators/only-identity.decorator");
const request_context_decorator_1 = require("../../decorators/request-context.decorator");
const success_response_decorator_1 = require("../../decorators/success-response.decorator");
const tag_dto_1 = require("./tag.dto");
const tag_service_1 = require("./tag.service");
let TagController = class TagController {
    tagService;
    constructor(tagService) {
        this.tagService = tagService;
    }
    getTags(query, { identity }) {
        const { sort, page, per_page, ...filters } = query;
        const queryFilter = {};
        const paginateOptions = { page, perPage: per_page, dateSort: sort };
        if (filters.keyword) {
            const keywordRegExp = new RegExp(filters.keyword, 'i');
            queryFilter.$or = [{ name: keywordRegExp }, { slug: keywordRegExp }, { description: keywordRegExp }];
        }
        return this.tagService.paginate(queryFilter, paginateOptions, !identity.isAdmin);
    }
    getAllTags({ identity }) {
        return identity.isAdmin
            ? this.tagService.getAllTags({ aggregatePublicOnly: false })
            : this.tagService.getAllPublicTagsCache();
    }
    getTag(id) {
        return this.tagService.getDetail(id);
    }
    createTag(dto) {
        return this.tagService.create(dto);
    }
    deleteTags({ tag_ids }) {
        return this.tagService.batchDelete(tag_ids);
    }
    updateTag(id, dto) {
        return this.tagService.update(id, dto);
    }
    deleteTag(id) {
        return this.tagService.delete(id);
    }
};
exports.TagController = TagController;
__decorate([
    (0, common_1.Get)(),
    (0, success_response_decorator_1.SuccessResponse)({ message: 'Get tags succeeded', usePaginate: true }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, request_context_decorator_1.RequestContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tag_dto_1.TagPaginateQueryDto, Object]),
    __metadata("design:returntype", Promise)
], TagController.prototype, "getTags", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, success_response_decorator_1.SuccessResponse)('Get all tags succeeded'),
    __param(0, (0, request_context_decorator_1.RequestContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TagController.prototype, "getAllTags", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, success_response_decorator_1.SuccessResponse)('Get tag succeeded'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TagController.prototype, "getTag", null);
__decorate([
    (0, common_1.Post)(),
    (0, only_identity_decorator_1.OnlyIdentity)(only_identity_decorator_1.IdentityRole.Admin),
    (0, success_response_decorator_1.SuccessResponse)('Create tag succeeded'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tag_dto_1.CreateTagDto]),
    __metadata("design:returntype", Promise)
], TagController.prototype, "createTag", null);
__decorate([
    (0, common_1.Delete)(),
    (0, only_identity_decorator_1.OnlyIdentity)(only_identity_decorator_1.IdentityRole.Admin),
    (0, success_response_decorator_1.SuccessResponse)('Delete tags succeeded'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tag_dto_1.TagIdsDto]),
    __metadata("design:returntype", void 0)
], TagController.prototype, "deleteTags", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, only_identity_decorator_1.OnlyIdentity)(only_identity_decorator_1.IdentityRole.Admin),
    (0, success_response_decorator_1.SuccessResponse)('Update Tag succeeded'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, tag_dto_1.UpdateTagDto]),
    __metadata("design:returntype", Promise)
], TagController.prototype, "updateTag", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, only_identity_decorator_1.OnlyIdentity)(only_identity_decorator_1.IdentityRole.Admin),
    (0, success_response_decorator_1.SuccessResponse)('Delete tag succeeded'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TagController.prototype, "deleteTag", null);
exports.TagController = TagController = __decorate([
    (0, common_1.Controller)('tags'),
    __metadata("design:paramtypes", [tag_service_1.TagService])
], TagController);
//# sourceMappingURL=tag.controller.js.map