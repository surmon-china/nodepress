"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiModule = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const options_module_1 = require("../options/options.module");
const article_module_1 = require("../article/article.module");
const comment_module_1 = require("../comment/comment.module");
const disqus_module_1 = require("../disqus/disqus.module");
const ai_controller_1 = require("./ai.controller");
const ai_listener_1 = require("./ai.listener");
const ai_service_1 = require("./ai.service");
let AiModule = class AiModule {
};
exports.AiModule = AiModule;
exports.AiModule = AiModule = __decorate([
    (0, common_1.Module)({
        imports: [axios_1.HttpModule, options_module_1.OptionsModule, article_module_1.ArticleModule, comment_module_1.CommentModule, disqus_module_1.DisqusModule],
        controllers: [ai_controller_1.AiController],
        providers: [ai_service_1.AiService, ai_listener_1.AiListener],
        exports: [ai_service_1.AiService]
    })
], AiModule);
//# sourceMappingURL=ai.module.js.map