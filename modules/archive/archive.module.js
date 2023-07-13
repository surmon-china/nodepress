"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArchiveModule = void 0;
const common_1 = require("@nestjs/common");
const category_model_1 = require("../category/category.model");
const article_model_1 = require("../article/article.model");
const tag_model_1 = require("../tag/tag.model");
const archive_controller_1 = require("./archive.controller");
const archive_service_1 = require("./archive.service");
let ArchiveModule = exports.ArchiveModule = class ArchiveModule {
};
exports.ArchiveModule = ArchiveModule = __decorate([
    (0, common_1.Module)({
        controllers: [archive_controller_1.ArchiveController],
        providers: [tag_model_1.TagProvider, category_model_1.CategoryProvider, article_model_1.ArticleProvider, archive_service_1.ArchiveService],
        exports: [archive_service_1.ArchiveService]
    })
], ArchiveModule);
//# sourceMappingURL=archive.module.js.map