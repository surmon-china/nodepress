"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoteModule = void 0;
const common_1 = require("@nestjs/common");
const option_module_1 = require("../option/option.module");
const article_module_1 = require("../article/article.module");
const comment_module_1 = require("../comment/comment.module");
const disqus_module_1 = require("../disqus/disqus.module");
const vote_controller_1 = require("./vote.controller");
let VoteModule = class VoteModule {
};
VoteModule = __decorate([
    (0, common_1.Module)({
        imports: [option_module_1.OptionModule, article_module_1.ArticleModule, comment_module_1.CommentModule, disqus_module_1.DisqusModule],
        controllers: [vote_controller_1.VoteController],
    })
], VoteModule);
exports.VoteModule = VoteModule;
//# sourceMappingURL=vote.module.js.map