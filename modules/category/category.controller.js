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
const admin_maybe_guard_1 = require("../../guards/admin-maybe.guard");
const permission_pipe_1 = require("../../pipes/permission.pipe");
const expose_pipe_1 = require("../../pipes/expose.pipe");
const queryparams_decorator_1 = require("../../decorators/queryparams.decorator");
const responser_decorator_1 = require("../../decorators/responser.decorator");
const category_dto_1 = require("./category.dto");
const category_service_1 = require("./category.service");
const category_model_1 = require("./category.model");
let CategoryController = class CategoryController {
    constructor(categoryService) {
        this.categoryService = categoryService;
    }
    getCategories(query, { isUnauthenticated }) {
        return this.categoryService.paginator({}, { page: query.page, perPage: query.per_page, dateSort: query.sort }, isUnauthenticated);
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
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(admin_maybe_guard_1.AdminMaybeGuard),
    responser_decorator_1.Responser.paginate(),
    responser_decorator_1.Responser.handle('Get categories'),
    __param(0, (0, common_1.Query)(permission_pipe_1.PermissionPipe, expose_pipe_1.ExposePipe)),
    __param(1, (0, queryparams_decorator_1.QueryParams)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [category_dto_1.CategoryPaginateQueryDTO, Object]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    responser_decorator_1.Responser.handle('Create category'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [category_model_1.Category]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Delete)(),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    responser_decorator_1.Responser.handle('Delete categories'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [category_dto_1.CategoriesDTO]),
    __metadata("design:returntype", void 0)
], CategoryController.prototype, "delCategories", null);
__decorate([
    (0, common_1.Get)(':id'),
    responser_decorator_1.Responser.handle('Get categories tree'),
    __param(0, (0, queryparams_decorator_1.QueryParams)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "getCategory", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    responser_decorator_1.Responser.handle('Update category'),
    __param(0, (0, queryparams_decorator_1.QueryParams)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, category_model_1.Category]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "putCategory", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    responser_decorator_1.Responser.handle('Delete category'),
    __param(0, (0, queryparams_decorator_1.QueryParams)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CategoryController.prototype, "delCategory", null);
CategoryController = __decorate([
    (0, common_1.Controller)('category'),
    __metadata("design:paramtypes", [category_service_1.CategoryService])
], CategoryController);
exports.CategoryController = CategoryController;
//# sourceMappingURL=category.controller.js.map