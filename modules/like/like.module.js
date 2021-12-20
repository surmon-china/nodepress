"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikeModule = void 0;
const common_1 = require("@nestjs/common");
const option_module_1 = require("../option/option.module");
const article_module_1 = require("../article/article.module");
const comment_module_1 = require("../comment/comment.module");
const like_controller_1 = require("./like.controller");
const like_service_1 = require("./like.service");
let LikeModule = class LikeModule {
};
LikeModule = __decorate([
    (0, common_1.Module)({
        imports: [option_module_1.OptionModule, article_module_1.ArticleModule, comment_module_1.CommentModule],
        controllers: [like_controller_1.LikeController],
        providers: [like_service_1.LikeService],
        exports: [like_service_1.LikeService],
    })
], LikeModule);
exports.LikeModule = LikeModule;
//# sourceMappingURL=like.module.js.map