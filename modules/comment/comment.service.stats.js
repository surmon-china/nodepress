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
exports.CommentStatsService = void 0;
const common_1 = require("@nestjs/common");
const model_transformer_1 = require("../../transformers/model.transformer");
const sort_constant_1 = require("../../constants/sort.constant");
const comment_constant_1 = require("./comment.constant");
const comment_model_1 = require("./comment.model");
const app_environment_1 = require("../../app.environment");
const logger_1 = require("../../utils/logger");
const logger = (0, logger_1.createLogger)({ scope: 'CommentStatsService', time: app_environment_1.isDevEnv });
let CommentStatsService = class CommentStatsService {
    commentModel;
    constructor(commentModel) {
        this.commentModel = commentModel;
    }
    countDocuments(queryFilter) {
        return this.commentModel.countDocuments(queryFilter).lean().exec();
    }
    getTotalCount(publicOnly) {
        return this.countDocuments(publicOnly ? comment_constant_1.COMMENT_PUBLIC_FILTER : {});
    }
    async getCalendar(publicOnly, timezone = 'GMT') {
        try {
            const calendar = await this.commentModel.aggregate([
                { $match: publicOnly ? comment_constant_1.COMMENT_PUBLIC_FILTER : {} },
                { $project: { day: { $dateToString: { date: '$created_at', format: '%Y-%m-%d', timezone } } } },
                { $group: { _id: '$day', count: { $sum: 1 } } },
                { $sort: { _id: sort_constant_1.SortOrder.Asc } }
            ]);
            return calendar.map(({ _id, count }) => ({ date: _id, count }));
        }
        catch (error) {
            throw new common_1.BadRequestException(`Invalid timezone identifier: '${timezone}'`, String(error));
        }
    }
};
exports.CommentStatsService = CommentStatsService;
exports.CommentStatsService = CommentStatsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, model_transformer_1.InjectModel)(comment_model_1.Comment)),
    __metadata("design:paramtypes", [Object])
], CommentStatsService);
//# sourceMappingURL=comment.service.stats.js.map