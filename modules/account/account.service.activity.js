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
exports.AccountActivityService = void 0;
const common_1 = require("@nestjs/common");
const sort_constant_1 = require("../../constants/sort.constant");
const model_transformer_1 = require("../../transformers/model.transformer");
const logger_1 = require("../../utils/logger");
const app_environment_1 = require("../../app.environment");
const comment_constant_1 = require("../comment/comment.constant");
const comment_model_1 = require("../comment/comment.model");
const vote_model_1 = require("../vote/vote.model");
const logger = (0, logger_1.createLogger)({ scope: 'AccountActivityService', time: app_environment_1.isDevEnv });
let AccountActivityService = class AccountActivityService {
    voteModel;
    commentModel;
    constructor(voteModel, commentModel) {
        this.voteModel = voteModel;
        this.commentModel = commentModel;
    }
    async getAllVotes(userObjectId) {
        return this.voteModel.find({ user: userObjectId }).sort({ created_at: sort_constant_1.SortOrder.Desc }).lean().exec();
    }
    getAllPublicComments(userObjectId) {
        return this.commentModel
            .find({ user: userObjectId, ...comment_constant_1.COMMENT_PUBLIC_FILTER })
            .sort({ created_at: sort_constant_1.SortOrder.Desc })
            .lean()
            .exec();
    }
    async deleteComment(userObjectId, commentId) {
        const result = await this.commentModel
            .updateOne({ id: commentId, user: userObjectId }, { $set: { status: comment_constant_1.CommentStatus.Trash } })
            .exec();
        if (result.matchedCount === 0) {
            throw new common_1.NotFoundException(`Comment '${commentId}' not found or not yours`);
        }
        return result;
    }
};
exports.AccountActivityService = AccountActivityService;
exports.AccountActivityService = AccountActivityService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, model_transformer_1.InjectModel)(vote_model_1.Vote)),
    __param(1, (0, model_transformer_1.InjectModel)(comment_model_1.Comment)),
    __metadata("design:paramtypes", [Object, Object])
], AccountActivityService);
//# sourceMappingURL=account.service.activity.js.map