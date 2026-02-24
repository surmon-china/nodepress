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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoteController = void 0;
const isUndefined_1 = __importDefault(require("lodash/isUndefined"));
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const only_identity_decorator_1 = require("../../decorators/only-identity.decorator");
const request_context_decorator_1 = require("../../decorators/request-context.decorator");
const success_response_decorator_1 = require("../../decorators/success-response.decorator");
const author_constant_1 = require("../../constants/author.constant");
const article_service_stats_1 = require("../article/article.service.stats");
const comment_service_1 = require("../comment/comment.service");
const user_service_1 = require("../user/user.service");
const helper_service_ip_1 = require("../../core/helper/helper.service.ip");
const vote_dto_1 = require("./vote.dto");
const vote_constant_1 = require("./vote.constant");
const vote_service_1 = require("./vote.service");
let VoteController = class VoteController {
    ipService;
    voteService;
    userService;
    commentService;
    articleStatsService;
    constructor(ipService, voteService, userService, commentService, articleStatsService) {
        this.ipService = ipService;
        this.voteService = voteService;
        this.userService = userService;
        this.commentService = commentService;
        this.articleStatsService = articleStatsService;
    }
    async votePost(dto, { visitor, identity }) {
        const result = await this.articleStatsService.incrementStatistics(dto.article_id, 'likes');
        const [user, ipLocation] = await Promise.all([
            identity.isUser ? this.userService.findOne(identity.payload.uid) : null,
            visitor.ip ? this.ipService.queryLocation(visitor.ip) : null
        ]);
        await this.voteService.create({
            target_type: vote_constant_1.VoteTargetType.Article,
            target_id: dto.article_id,
            vote_type: dto.vote,
            ...(0, author_constant_1.resolveGeneralAuthor)(dto, user),
            user_agent: visitor.agent,
            ip: visitor.ip,
            ip_location: ipLocation
        });
        return result;
    }
    async voteComment(dto, { visitor, identity }) {
        const result = await this.commentService.incrementVote(dto.comment_id, dto.vote === vote_constant_1.VoteType.Upvote ? 'likes' : 'dislikes');
        const [user, ipLocation] = await Promise.all([
            identity.isUser ? this.userService.findOne(identity.payload.uid) : null,
            visitor.ip ? this.ipService.queryLocation(visitor.ip) : null
        ]);
        await this.voteService.create({
            target_type: vote_constant_1.VoteTargetType.Comment,
            target_id: dto.comment_id,
            vote_type: dto.vote,
            ...(0, author_constant_1.resolveGeneralAuthor)(dto, user),
            user_agent: visitor.agent,
            ip: visitor.ip,
            ip_location: ipLocation
        });
        return result;
    }
    getVotes(query) {
        const { sort, page, per_page, ...filters } = query;
        const queryFilter = {};
        const paginateOptions = { page, perPage: per_page, dateSort: sort };
        if (!(0, isUndefined_1.default)(filters.target_type)) {
            queryFilter.target_type = filters.target_type;
        }
        if (!(0, isUndefined_1.default)(filters.target_id)) {
            queryFilter.target_id = filters.target_id;
        }
        if (!(0, isUndefined_1.default)(filters.vote_type)) {
            queryFilter.vote_type = filters.vote_type;
        }
        if (!(0, isUndefined_1.default)(filters.author_type)) {
            queryFilter.author_type = filters.author_type;
        }
        return this.voteService.paginate(queryFilter, {
            ...paginateOptions,
            populate: 'user'
        });
    }
    deleteVotes({ vote_ids }) {
        return this.voteService.batchDelete(vote_ids);
    }
};
exports.VoteController = VoteController;
__decorate([
    (0, common_1.Post)('/article'),
    (0, throttler_1.Throttle)({ default: { ttl: (0, throttler_1.minutes)(1), limit: 10 } }),
    (0, success_response_decorator_1.SuccessResponse)('Vote article succeeded'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, request_context_decorator_1.RequestContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [vote_dto_1.ArticleVoteDto, Object]),
    __metadata("design:returntype", Promise)
], VoteController.prototype, "votePost", null);
__decorate([
    (0, common_1.Post)('/comment'),
    (0, throttler_1.Throttle)({ default: { ttl: (0, throttler_1.seconds)(30), limit: 10 } }),
    (0, success_response_decorator_1.SuccessResponse)('Vote comment succeeded'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, request_context_decorator_1.RequestContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [vote_dto_1.CommentVoteDto, Object]),
    __metadata("design:returntype", Promise)
], VoteController.prototype, "voteComment", null);
__decorate([
    (0, common_1.Get)(),
    (0, only_identity_decorator_1.OnlyIdentity)(only_identity_decorator_1.IdentityRole.Admin),
    (0, success_response_decorator_1.SuccessResponse)({ message: 'Get votes succeeded', usePaginate: true }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [vote_dto_1.VotePaginateQueryDto]),
    __metadata("design:returntype", Promise)
], VoteController.prototype, "getVotes", null);
__decorate([
    (0, common_1.Delete)(),
    (0, only_identity_decorator_1.OnlyIdentity)(only_identity_decorator_1.IdentityRole.Admin),
    (0, success_response_decorator_1.SuccessResponse)('Delete votes succeeded'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [vote_dto_1.VoteIdsDto]),
    __metadata("design:returntype", void 0)
], VoteController.prototype, "deleteVotes", null);
exports.VoteController = VoteController = __decorate([
    (0, common_1.Controller)('votes'),
    __metadata("design:paramtypes", [helper_service_ip_1.IPService,
        vote_service_1.VoteService,
        user_service_1.UserService,
        comment_service_1.CommentService,
        article_service_stats_1.ArticleStatsService])
], VoteController);
//# sourceMappingURL=vote.controller.js.map