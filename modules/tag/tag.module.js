"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagModule = void 0;
const common_1 = require("@nestjs/common");
const article_module_1 = require("../article/article.module");
const tag_controller_1 = require("./tag.controller");
const tag_model_1 = require("./tag.model");
const tag_service_1 = require("./tag.service");
const tag_listener_1 = require("./tag.listener");
let TagModule = class TagModule {
};
exports.TagModule = TagModule;
exports.TagModule = TagModule = __decorate([
    (0, common_1.Module)({
        imports: [(0, common_1.forwardRef)(() => article_module_1.ArticleModule)],
        controllers: [tag_controller_1.TagController],
        providers: [tag_model_1.TagProvider, tag_service_1.TagService, tag_listener_1.TagListener],
        exports: [tag_service_1.TagService]
    })
], TagModule);
//# sourceMappingURL=tag.module.js.map