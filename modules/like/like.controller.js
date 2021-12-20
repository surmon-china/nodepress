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
exports.LikeController = exports.LikeArticle = exports.LikeComment = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const class_validator_1 = require("class-validator");
const common_1 = require("@nestjs/common");
const http_decorator_1 = require("../../decorators/http.decorator");
const like_service_1 = require("./like.service");
class LikeComment {
}
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsInt)(),
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], LikeComment.prototype, "comment_id", void 0);
exports.LikeComment = LikeComment;
class LikeArticle {
}
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsInt)(),
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], LikeArticle.prototype, "article_id", void 0);
exports.LikeArticle = LikeArticle;
let LikeController = class LikeController {
    constructor(likeService) {
        this.likeService = likeService;
    }
    likeSite() {
        return this.likeService.likeSite();
    }
    likeComment(likeComment) {
        return this.likeService.likeComment(likeComment.comment_id);
    }
    likeArticle(likeArticle) {
        return this.likeService.likeArticle(likeArticle.article_id);
    }
};
__decorate([
    (0, common_1.Patch)('site'),
    http_decorator_1.HttpProcessor.handle('爱你么么扎！喜欢主站'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LikeController.prototype, "likeSite", null);
__decorate([
    (0, common_1.Patch)('comment'),
    http_decorator_1.HttpProcessor.handle('爱你么么扎！点赞评论'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LikeComment]),
    __metadata("design:returntype", Promise)
], LikeController.prototype, "likeComment", null);
__decorate([
    (0, common_1.Patch)('article'),
    http_decorator_1.HttpProcessor.handle('爱你么么扎！点赞文章'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LikeArticle]),
    __metadata("design:returntype", Promise)
], LikeController.prototype, "likeArticle", null);
LikeController = __decorate([
    (0, common_1.Controller)('like'),
    __metadata("design:paramtypes", [like_service_1.LikeService])
], LikeController);
exports.LikeController = LikeController;
//# sourceMappingURL=like.controller.js.map