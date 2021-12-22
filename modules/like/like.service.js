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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikeService = void 0;
const common_1 = require("@nestjs/common");
const option_service_1 = require("../option/option.service");
const article_service_1 = require("../article/article.service");
const comment_service_1 = require("../comment/comment.service");
let LikeService = class LikeService {
    constructor(optionService, articleService, commentService) {
        this.optionService = optionService;
        this.articleService = articleService;
        this.commentService = commentService;
    }
    async likeSite() {
        const option = await this.optionService.getDBOption();
        option.meta.likes++;
        await option.save();
        await this.optionService.updateCache();
        return true;
    }
    async likeComment(commentID) {
        const comment = await this.commentService.getDetailByNumberId(commentID);
        comment.likes++;
        await comment.save();
        return true;
    }
    async likeArticle(articleID) {
        const article = await this.articleService.getDetailByNumberId(articleID);
        article.meta.likes++;
        await article.save();
        return true;
    }
};
LikeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [option_service_1.OptionService,
        article_service_1.ArticleService,
        comment_service_1.CommentService])
], LikeService);
exports.LikeService = LikeService;
//# sourceMappingURL=like.service.js.map