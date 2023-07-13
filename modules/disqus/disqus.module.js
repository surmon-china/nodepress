"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisqusModule = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const option_module_1 = require("../option/option.module");
const article_module_1 = require("../article/article.module");
const comment_module_1 = require("../comment/comment.module");
const disqus_controller_1 = require("./disqus.controller");
const disqus_service_public_1 = require("./disqus.service.public");
const disqus_service_private_1 = require("./disqus.service.private");
let DisqusModule = exports.DisqusModule = class DisqusModule {
};
exports.DisqusModule = DisqusModule = __decorate([
    (0, common_1.Module)({
        imports: [axios_1.HttpModule, option_module_1.OptionModule, article_module_1.ArticleModule, comment_module_1.CommentModule],
        controllers: [disqus_controller_1.DisqusController],
        providers: [disqus_service_public_1.DisqusPublicService, disqus_service_private_1.DisqusPrivateService],
        exports: [disqus_service_public_1.DisqusPublicService, disqus_service_private_1.DisqusPrivateService]
    })
], DisqusModule);
//# sourceMappingURL=disqus.module.js.map