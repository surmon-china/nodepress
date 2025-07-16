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
const admin_only_guard_1 = require("../../guards/admin-only.guard");
const admin_optional_guard_1 = require("../../guards/admin-optional.guard");
const permission_pipe_1 = require("../../pipes/permission.pipe");
const request_context_decorator_1 = require("../../decorators/request-context.decorator");
const success_response_decorator_1 = require("../../decorators/success-response.decorator");
const category_dto_1 = require("./category.dto");
const category_service_1 = require("./category.service");
const category_model_1 = require("./category.model");
let CategoryController = class CategoryController {
    categoryService;
    constructor(categoryService) {
        this.categoryService = categoryService;
    }
    getCategories(query, { isUnauthenticated }) {
        return this.categoryService.paginate({}, { page: query.page, perPage: query.per_page, dateSort: query.sort }, isUnauthenticated);
    }
    getAllCategories({ isAuthenticated }) {
        return isAuthenticated
            ? this.categoryService.getAllCategories({ aggregatePublicOnly: false })
            : this.categoryService.getAllCategoriesCache();
    }
    createCategory(category) {
        return this.categoryService.create(category);
    }
    delCategories(body) {
        return this.categoryService.batchDelete(body.category_ids);
    }
    getCategory({ params }) {
        return this.categoryService.getGenealogyById(params.id);
    }
    putCategory({ params }, category) {
        return this.categoryService.update(params.id, category);
    }
    delCategory({ params }) {
        return this.categoryService.delete(params.id);
    }
};
exports.CategoryController = CategoryController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(admin_optional_guard_1.AdminOptionalGuard),
    (0, success_response_decorator_1.SuccessResponse)({ message: 'Get categories succeeded', usePaginate: true }),
    __param(0, (0, common_1.Query)(permission_pipe_1.PermissionPipe)),
    __param(1, (0, request_context_decorator_1.RequestContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [category_dto_1.CategoryPaginateQueryDTO, Object]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, common_1.UseGuards)(admin_optional_guard_1.AdminOptionalGuard),
    (0, success_response_decorator_1.SuccessResponse)('Get all categories succeeded'),
    __param(0, (0, request_context_decorator_1.RequestContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "getAllCategories", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    (0, success_response_decorator_1.SuccessResponse)('Create category succeeded'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [category_model_1.Category]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Delete)(),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    (0, success_response_decorator_1.SuccessResponse)('Delete categories succeeded'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [category_dto_1.CategoriesDTO]),
    __metadata("design:returntype", void 0)
], CategoryController.prototype, "delCategories", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, success_response_decorator_1.SuccessResponse)('Get categories tree succeeded'),
    __param(0, (0, request_context_decorator_1.RequestContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "getCategory", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    (0, success_response_decorator_1.SuccessResponse)('Update category succeeded'),
    __param(0, (0, request_context_decorator_1.RequestContext)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, category_model_1.Category]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "putCategory", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    (0, success_response_decorator_1.SuccessResponse)('Delete category succeeded'),
    __param(0, (0, request_context_decorator_1.RequestContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CategoryController.prototype, "delCategory", null);
exports.CategoryController = CategoryController = __decorate([
    (0, common_1.Controller)('category'),
    __metadata("design:paramtypes", [category_service_1.CategoryService])
], CategoryController);
//# sourceMappingURL=category.controller.js.map