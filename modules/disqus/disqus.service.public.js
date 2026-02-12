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
exports.DisqusPublicService = void 0;
const common_1 = require("@nestjs/common");
const comment_service_1 = require("../comment/comment.service");
const comment_constant_1 = require("../comment/comment.constant");
const extras_constant_1 = require("../../constants/extras.constant");
const cache_constant_1 = require("../../constants/cache.constant");
const cache_service_1 = require("../../core/cache/cache.service");
const app_config_1 = require("../../app.config");
const disqus_1 = require("../../utils/disqus");
const extra_transformer_1 = require("../../transformers/extra.transformer");
const urlmap_transformer_1 = require("../../transformers/urlmap.transformer");
const disqus_service_private_1 = require("./disqus.service.private");
const logger_1 = require("../../utils/logger");
const app_environment_1 = require("../../app.environment");
const disqus_helper_1 = require("./disqus.helper");
const logger = (0, logger_1.createLogger)({ scope: 'DisqusPublicService', time: app_environment_1.isDevEnv });
let DisqusPublicService = class DisqusPublicService {
    cacheService;
    commentService;
    disqusPrivateService;
    disqus;
    constructor(cacheService, commentService, disqusPrivateService) {
        this.cacheService = cacheService;
        this.commentService = commentService;
        this.disqusPrivateService = disqusPrivateService;
        this.disqus = new disqus_1.Disqus({
            apiKey: app_config_1.DISQUS.publicKey,
            apiSecret: app_config_1.DISQUS.secretKey
        });
    }
    getUserInfoCacheKey(uid) {
        return (0, cache_constant_1.getDisqusCacheKey)(`userinfo-${uid}`);
    }
    setUserInfoCache(uid, userInfo, ttl) {
        return this.cacheService.set(this.getUserInfoCacheKey(uid), userInfo, ttl);
    }
    getUserInfoCache(uid) {
        return this.cacheService.get(this.getUserInfoCacheKey(uid));
    }
    deleteUserInfoCache(uid) {
        return this.cacheService.delete(this.getUserInfoCacheKey(uid));
    }
    getAuthorizeURL() {
        return this.disqus.getAuthorizeURL('code', 'read,write', disqus_helper_1.DISQUS_OAUTH_CALLBACK_URL);
    }
    async getAccessToken(code) {
        return this.disqus.getOAuthAccessToken(code, disqus_helper_1.DISQUS_OAUTH_CALLBACK_URL).catch((error) => {
            logger.warn('getAccessToken failed!', error);
            return Promise.reject(error);
        });
    }
    async refreshAccessToken(refreshToken) {
        return this.disqus.refreshOAuthAccessToken(refreshToken).catch((error) => {
            logger.warn('refreshAccessToken failed!', error);
            return Promise.reject(error);
        });
    }
    getUserInfo(accessToken) {
        return this.disqus
            .request('users/details', { access_token: accessToken })
            .then((response) => response.response)
            .catch((error) => {
            logger.warn('getUserInfo failed!', error);
            return Promise.reject(error);
        });
    }
    ensureThreadDetail(postId) {
        return this.disqus
            .request('threads/details', { forum: app_config_1.DISQUS.forum, thread: `link:${(0, urlmap_transformer_1.getPermalinkById)(postId)}` })
            .then((response) => response.response)
            .catch(() => this.disqusPrivateService.createThread(postId));
    }
    async ensureThreadDetailCache(postId) {
        const cacheKey = (0, cache_constant_1.getDisqusCacheKey)(`thread-post-${postId}`);
        const cached = await this.cacheService.get(cacheKey);
        if (cached) {
            return cached;
        }
        const result = await this.ensureThreadDetail(postId);
        this.cacheService.set(cacheKey, result, 60 * 60 * 24);
        return result;
    }
    async voteThread(params) {
        return this.disqus.request('threads/vote', params, { asPublic: true }).catch((error) => {
            logger.warn('voteThread failed!', error);
            return Promise.reject(error);
        });
    }
    async votePost(params) {
        return this.disqus.request('posts/vote', params).catch((error) => {
            logger.warn('votePost failed!', error);
            return Promise.reject(error);
        });
    }
    async getDisqusPostIdByCommentId(commentId) {
        try {
            const comment = await this.commentService.getDetailByNumberId(commentId);
            return (0, extra_transformer_1.getExtraValue)(comment.extras, extras_constant_1.CommentDisqusExtraKeys.PostId) || null;
        }
        catch (error) {
            return null;
        }
    }
    async createDisqusComment(payload) {
        const { comment, threadId, parentId, accessToken } = payload;
        const body = {
            message: comment.content,
            parent: parentId,
            thread: threadId
        };
        if (accessToken) {
            body.access_token = accessToken;
        }
        else {
            body.author_email = comment.author.email;
            body.author_name = comment.author.name;
            body.author_url = comment.author.site;
        }
        return (this.disqus
            .request('posts/create', body, { asPublic: !accessToken })
            .then((response) => response.response)
            .catch((error) => {
            logger.warn('createDisqusComment failed!', error);
            return Promise.reject(error);
        }));
    }
    async createUniversalComment(comment, visitor, accessToken) {
        const newComment = this.commentService.normalizeNewComment(comment, visitor);
        await Promise.all([
            this.commentService.verifyTargetCommentable(newComment.post_id),
            this.commentService.verifyCommentValidity(newComment)
        ]);
        const thread = await this.ensureThreadDetailCache(newComment.post_id);
        let parentId = null;
        if (newComment.pid) {
            parentId = await this.getDisqusPostIdByCommentId(newComment.pid);
        }
        const disqusPost = await this.createDisqusComment({
            comment: newComment,
            threadId: thread.id,
            parentId: parentId,
            accessToken
        });
        if (disqusPost.author.isAnonymous && !disqusPost.isApproved) {
            await this.disqusPrivateService.approvePost({ post: disqusPost.id, newUserPremodBypass: 1 }).catch(() => { });
        }
        newComment.author.name = disqusPost.author.name || newComment.author.name;
        newComment.author.site = disqusPost.author.url || newComment.author.site;
        newComment.extras.push({ key: extras_constant_1.CommentDisqusExtraKeys.PostId, value: disqusPost.id }, { key: extras_constant_1.CommentDisqusExtraKeys.ThreadId, value: disqusPost.thread });
        if (disqusPost.author.isAnonymous || !accessToken) {
            newComment.extras.push({ key: extras_constant_1.CommentDisqusExtraKeys.Anonymous, value: 'true' });
        }
        else {
            newComment.extras.push({ key: extras_constant_1.CommentDisqusExtraKeys.AuthorId, value: disqusPost.author.id }, { key: extras_constant_1.CommentDisqusExtraKeys.AuthorUsername, value: disqusPost.author.username });
        }
        return await this.commentService.create(newComment);
    }
    async deleteDisqusComment(params) {
        return this.disqus
            .request('posts/remove', params)
            .then((response) => response.response)
            .catch((error) => {
            logger.warn('deleteDisqusComment failed!', error);
            return Promise.reject(error);
        });
    }
    async deleteUniversalComment(commentId, accessToken) {
        const comment = await this.commentService.getDetailByNumberId(commentId);
        if (!comment)
            throw new common_1.NotFoundException(`Comment '${commentId}' not found`);
        const extrasMap = (0, extra_transformer_1.getExtrasMap)(comment.extras);
        const commentDisqusPostId = extrasMap.get(extras_constant_1.CommentDisqusExtraKeys.PostId);
        const commentDisqusAuthorId = extrasMap.get(extras_constant_1.CommentDisqusExtraKeys.AuthorId);
        if (!commentDisqusAuthorId || !commentDisqusPostId) {
            throw new common_1.BadRequestException(`Comment '${commentId}' cannot be deleted (missing Disqus metadata)`);
        }
        const userInfo = await this.getUserInfo(accessToken);
        if (userInfo.id !== commentDisqusAuthorId) {
            throw new common_1.ForbiddenException(`You do not have permission to delete comment '${commentId}'`);
        }
        await this.deleteDisqusComment({
            post: commentDisqusPostId,
            access_token: accessToken
        });
        return await this.commentService.update(comment._id, { status: comment_constant_1.CommentStatus.Trash });
    }
};
exports.DisqusPublicService = DisqusPublicService;
exports.DisqusPublicService = DisqusPublicService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cache_service_1.CacheService,
        comment_service_1.CommentService,
        disqus_service_private_1.DisqusPrivateService])
], DisqusPublicService);
//# sourceMappingURL=disqus.service.public.js.map