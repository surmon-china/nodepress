"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryModule = void 0;
const common_1 = require("@nestjs/common");
const archive_module_1 = require("../archive/archive.module");
const article_model_1 = require("../article/article.model");
const category_controller_1 = require("./category.controller");
const category_model_1 = require("./category.model");
const category_service_1 = require("./category.service");
let CategoryModule = exports.CategoryModule = class CategoryModule {
};
exports.CategoryModule = CategoryModule = __decorate([
    (0, common_1.Module)({
        imports: [archive_module_1.ArchiveModule],
        controllers: [category_controller_1.CategoryController],
        providers: [article_model_1.ArticleProvider, category_model_1.CategoryProvider, category_service_1.CategoryService],
        exports: [category_service_1.CategoryService]
    })
], CategoryModule);
//# sourceMappingURL=category.module.js.map