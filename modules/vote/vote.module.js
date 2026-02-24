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
const user_module_1 = require("../user/user.module");
const article_module_1 = require("../article/article.module");
const comment_module_1 = require("../comment/comment.module");
const vote_model_1 = require("./vote.model");
const vote_service_1 = require("./vote.service");
const vote_listener_1 = require("./vote.listener");
const vote_controller_1 = require("./vote.controller");
let VoteModule = class VoteModule {
};
exports.VoteModule = VoteModule;
exports.VoteModule = VoteModule = __decorate([
    (0, common_1.Module)({
        imports: [user_module_1.UserModule, article_module_1.ArticleModule, comment_module_1.CommentModule],
        controllers: [vote_controller_1.VoteController],
        providers: [vote_model_1.VoteProvider, vote_service_1.VoteService, vote_listener_1.VoteListener],
        exports: [vote_service_1.VoteService]
    })
], VoteModule);
//# sourceMappingURL=vote.module.js.map