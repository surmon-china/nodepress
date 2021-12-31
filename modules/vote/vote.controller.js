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
exports.VoteController = exports.ArticleVotePayload = exports.CommentVotePayload = void 0;
const class_validator_1 = require("class-validator");
const common_1 = require("@nestjs/common");
const http_decorator_1 = require("../../decorators/http.decorator");
const option_service_1 = require("../option/option.service");
const article_service_1 = require("../article/article.service");
const comment_service_1 = require("../comment/comment.service");
const disqus_service_public_1 = require("../disqus/disqus.service.public");
const disqus_token_1 = require("../disqus/disqus.token");
const biz_interface_1 = require("../../interfaces/biz.interface");
class CommentVotePayload {
}
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CommentVotePayload.prototype, "comment_id", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsIn)([1, -1]),
    __metadata("design:type", Number)
], CommentVotePayload.prototype, "vote", void 0);
exports.CommentVotePayload = CommentVotePayload;
class ArticleVotePayload {
}
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], ArticleVotePayload.prototype, "article_id", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsIn)([1]),
    __metadata("design:type", Number)
], ArticleVotePayload.prototype, "vote", void 0);
exports.ArticleVotePayload = ArticleVotePayload;
let VoteController = class VoteController {
    constructor(disqusPublicService, commentService, articleService, optionService) {
        this.disqusPublicService = disqusPublicService;
        this.commentService = commentService;
        this.articleService = articleService;
        this.optionService = optionService;
    }
    async voteDisqusThread(articleID, vote, token) {
        const thread = await this.disqusPublicService.makeSureThreadDetail(articleID);
        const result = await this.disqusPublicService.voteThread({
            access_token: token || null,
            thread: thread.id,
            vote,
        });
        return result;
    }
    async likeSite(token) {
        const likes = await this.optionService.likeSite();
        this.voteDisqusThread(biz_interface_1.CommentPostID.Guestbook, 1, token === null || token === void 0 ? void 0 : token.access_token).catch(() => { });
        return likes;
    }
    async voteArticle(voteBody, token) {
        const likes = await this.articleService.like(voteBody.article_id);
        this.voteDisqusThread(voteBody.article_id, voteBody.vote, token === null || token === void 0 ? void 0 : token.access_token).catch(() => { });
        return likes;
    }
    async voteComment(voteBody, token) {
        const result = await this.commentService.vote(voteBody.comment_id, voteBody.vote > 0);
        if (token) {
            try {
                const postID = await this.disqusPublicService.getDisqusPostIDByCommentID(voteBody.comment_id);
                if (postID) {
                    const result = await this.disqusPublicService.votePost({
                        access_token: token.access_token,
                        post: postID,
                        vote: voteBody.vote,
                    });
                }
            }
            catch (error) { }
        }
        return result;
    }
};
__decorate([
    (0, common_1.Post)('/site'),
    http_decorator_1.HttpProcessor.handle('Vote site'),
    __param(0, (0, disqus_token_1.CookieToken)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VoteController.prototype, "likeSite", null);
__decorate([
    (0, common_1.Post)('/article'),
    http_decorator_1.HttpProcessor.handle('Vote article'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, disqus_token_1.CookieToken)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ArticleVotePayload, Object]),
    __metadata("design:returntype", Promise)
], VoteController.prototype, "voteArticle", null);
__decorate([
    (0, common_1.Post)('/comment'),
    http_decorator_1.HttpProcessor.handle('Vote comment'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, disqus_token_1.CookieToken)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CommentVotePayload, Object]),
    __metadata("design:returntype", Promise)
], VoteController.prototype, "voteComment", null);
VoteController = __decorate([
    (0, common_1.Controller)('vote'),
    __metadata("design:paramtypes", [disqus_service_public_1.DisqusPublicService,
        comment_service_1.CommentService,
        article_service_1.ArticleService,
        option_service_1.OptionService])
], VoteController);
exports.VoteController = VoteController;
//# sourceMappingURL=vote.controller.js.map