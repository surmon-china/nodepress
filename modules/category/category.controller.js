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
exports.CategoryController = void 0;
const common_1 = require("@nestjs/common");
const request_context_decorator_1 = require("../../decorators/request-context.decorator");
const only_identity_decorator_1 = require("../../decorators/only-identity.decorator");
const success_response_decorator_1 = require("../../decorators/success-response.decorator");
const category_dto_1 = require("./category.dto");
const category_dto_2 = require("./category.dto");
const category_service_1 = require("./category.service");
let CategoryController = class CategoryController {
    categoryService;
    constructor(categoryService) {
        this.categoryService = categoryService;
    }
    getCategories(query, { identity }) {
        const { sort, page, per_page, ...filters } = query;
        const queryFilter = {};
        const paginateOptions = { page, perPage: per_page, dateSort: sort };
        if (filters.keyword) {
            const keywordRegExp = new RegExp(filters.keyword, 'i');
            queryFilter.$or = [{ name: keywordRegExp }, { slug: keywordRegExp }, { description: keywordRegExp }];
        }
        return this.categoryService.paginate(queryFilter, paginateOptions, !identity.isAdmin);
    }
    getAllCategories({ identity }) {
        return identity.isAdmin
            ? this.categoryService.getAllCategories({ aggregatePublicOnly: false })
            : this.categoryService.getAllPublicCategoriesCache();
    }
    getCategory(id) {
        return this.categoryService.getDetail(id);
    }
    createCategory(dto) {
        return this.categoryService.create(dto);
    }
    deleteCategories({ category_ids }) {
        return this.categoryService.batchDelete(category_ids);
    }
    updateCategory(id, dto) {
        return this.categoryService.update(id, dto);
    }
    deleteCategory(id) {
        return this.categoryService.delete(id);
    }
};
exports.CategoryController = CategoryController;
__decorate([
    (0, common_1.Get)(),
    (0, success_response_decorator_1.SuccessResponse)({ message: 'Get categories succeeded', usePaginate: true }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, request_context_decorator_1.RequestContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [category_dto_1.CategoryPaginateQueryDto, Object]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, success_response_decorator_1.SuccessResponse)('Get all categories succeeded'),
    __param(0, (0, request_context_decorator_1.RequestContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "getAllCategories", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, success_response_decorator_1.SuccessResponse)('Get category succeeded'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "getCategory", null);
__decorate([
    (0, common_1.Post)(),
    (0, only_identity_decorator_1.OnlyIdentity)(only_identity_decorator_1.IdentityRole.Admin),
    (0, success_response_decorator_1.SuccessResponse)('Create category succeeded'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [category_dto_2.CreateCategoryDto]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Delete)(),
    (0, only_identity_decorator_1.OnlyIdentity)(only_identity_decorator_1.IdentityRole.Admin),
    (0, success_response_decorator_1.SuccessResponse)('Delete categories succeeded'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [category_dto_1.CategoryIdsDto]),
    __metadata("design:returntype", void 0)
], CategoryController.prototype, "deleteCategories", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, only_identity_decorator_1.OnlyIdentity)(only_identity_decorator_1.IdentityRole.Admin),
    (0, success_response_decorator_1.SuccessResponse)('Update category succeeded'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, category_dto_2.UpdateCategoryDto]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "updateCategory", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, only_identity_decorator_1.OnlyIdentity)(only_identity_decorator_1.IdentityRole.Admin),
    (0, success_response_decorator_1.SuccessResponse)('Delete category succeeded'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CategoryController.prototype, "deleteCategory", null);
exports.CategoryController = CategoryController = __decorate([
    (0, common_1.Controller)('categories'),
    __metadata("design:paramtypes", [category_service_1.CategoryService])
], CategoryController);
//# sourceMappingURL=category.controller.js.map