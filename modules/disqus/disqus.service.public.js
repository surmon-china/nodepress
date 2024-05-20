"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisqusPublicService = void 0;
const common_1 = require("@nestjs/common");
const comment_service_1 = require("../comment/comment.service");
const biz_constant_1 = require("../../constants/biz.constant");
const cache_constant_1 = require("../../constants/cache.constant");
const cache_service_1 = require("../../processors/cache/cache.service");
const app_config_1 = require("../../app.config");
const disqus_1 = require("../../utils/disqus");
const extend_transformer_1 = require("../../transformers/extend.transformer");
const urlmap_transformer_1 = require("../../transformers/urlmap.transformer");
const disqus_service_private_1 = require("./disqus.service.private");
const logger_1 = require("../../utils/logger");
const app_environment_1 = require("../../app.environment");
const DISQUS_CONST = __importStar(require("./disqus.constant"));
const logger = (0, logger_1.createLogger)({ scope: 'DisqusPublicService', time: app_environment_1.isDevEnv });
let DisqusPublicService = class DisqusPublicService {
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
        return this.disqus.getAuthorizeURL('code', 'read,write', DISQUS_CONST.DISQUS_OAUTH_CALLBACK_URL);
    }
    async getAccessToken(code) {
        return this.disqus.getOAuthAccessToken(code, DISQUS_CONST.DISQUS_OAUTH_CALLBACK_URL).catch((error) => {
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
        return this.disqus.request('threads/vote', params, true).catch((error) => {
            logger.warn('voteThread failed!', error);
            return Promise.reject(error);
        });
    }
    async votePost(params) {
        https: return this.disqus.request('posts/vote', params).catch((error) => {
            logger.warn('votePost failed!', error);
            return Promise.reject(error);
        });
    }
    async getDisqusPostIdByCommentId(commentId) {
        try {
            const comment = await this.commentService.getDetailByNumberId(commentId);
            return (0, extend_transformer_1.getExtendValue)(comment.extends, DISQUS_CONST.COMMENT_POST_ID_EXTEND_KEY) || null;
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
            .request('posts/create', body, !accessToken)
            .then((response) => response.response)
            .catch((error) => {
            logger.warn('createDisqusComment failed!', error);
            return Promise.reject(error);
        }));
    }
    async createUniversalComment(comment, visitor, accessToken) {
        const newComment = this.commentService.normalizeNewComment(comment, visitor);
        await this.commentService.verifyTargetCommentable(newComment.post_id);
        const thread = await this.ensureThreadDetailCache(newComment.post_id);
        await this.commentService.verifyCommentValidity(newComment);
        let parentId = null;
        if (Boolean(newComment.pid)) {
            parentId = await this.getDisqusPostIdByCommentId(newComment.pid);
        }
        const disqusPost = await this.createDisqusComment({
            comment: newComment,
            threadId: thread.id,
            parentId: parentId,
            accessToken
        });
        if (disqusPost.author.isAnonymous && !disqusPost.isApproved) {
            try {
                await this.disqusPrivateService.approvePost({ post: disqusPost.id, newUserPremodBypass: 1 });
            }
            catch (error) { }
        }
        newComment.author.name = disqusPost.author.name || newComment.author.name;
        newComment.author.site = disqusPost.author.url || newComment.author.site;
        newComment.extends.push({ name: DISQUS_CONST.COMMENT_POST_ID_EXTEND_KEY, value: disqusPost.id }, { name: DISQUS_CONST.COMMENT_THREAD_ID_EXTEND_KEY, value: disqusPost.thread });
        if (disqusPost.author.isAnonymous || !accessToken) {
            newComment.extends.push({ name: DISQUS_CONST.COMMENT_ANONYMOUS_EXTEND_KEY, value: 'true' });
        }
        else {
            newComment.extends.push({ name: DISQUS_CONST.COMMENT_AUTHOR_ID_EXTEND_KEY, value: disqusPost.author.id }, { name: DISQUS_CONST.COMMENT_AUTHOR_USERNAME_EXTEND_KEY, value: disqusPost.author.username });
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
        if (!comment) {
            throw 'Comment not found';
        }
        const extendsObject = (0, extend_transformer_1.getExtendObject)(comment.extends);
        const commentDisqusPostId = extendsObject[DISQUS_CONST.COMMENT_POST_ID_EXTEND_KEY];
        const commentDisqusAuthorId = extendsObject[DISQUS_CONST.COMMENT_AUTHOR_ID_EXTEND_KEY];
        if (!commentDisqusAuthorId || !commentDisqusPostId) {
            throw 'Comment not deletable';
        }
        const userInfo = await this.getUserInfo(accessToken);
        if (userInfo.id !== commentDisqusAuthorId) {
            throw `You do not have write privileges on comment '${commentId}'`;
        }
        await this.deleteDisqusComment({
            post: commentDisqusPostId,
            access_token: accessToken
        });
        return await this.commentService.update(comment._id, { state: biz_constant_1.CommentState.Deleted });
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