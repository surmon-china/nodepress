"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisqusPublicService = void 0;
const common_1 = require("@nestjs/common");
const comment_service_1 = require("../comment/comment.service");
const biz_interface_1 = require("../../interfaces/biz.interface");
const cache_constant_1 = require("../../constants/cache.constant");
const cache_service_1 = require("../../processors/cache/cache.service");
const app_config_1 = require("../../app.config");
const disqus_1 = require("../../utils/disqus");
const extend_transformer_1 = require("../../transformers/extend.transformer");
const urlmap_transformer_1 = require("../../transformers/urlmap.transformer");
const disqus_service_private_1 = require("./disqus.service.private");
const logger_1 = __importDefault(require("../../utils/logger"));
const DISQUS_CONST = __importStar(require("./disqus.constant"));
let DisqusPublicService = class DisqusPublicService {
    constructor(cacheService, commentService, disqusPrivateService) {
        this.cacheService = cacheService;
        this.commentService = commentService;
        this.disqusPrivateService = disqusPrivateService;
        this.disqus = new disqus_1.Disqus({
            apiKey: app_config_1.DISQUS.publicKey,
            apiSecret: app_config_1.DISQUS.secretKey,
        });
    }
    getUserInfoCacheKey(uid) {
        return (0, cache_constant_1.getDisqusCacheKey)(`userinfo-${uid}`);
    }
    setUserInfoCache(uid, userInfo, ttl) {
        return this.cacheService.set(this.getUserInfoCacheKey(uid), userInfo, { ttl });
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
            logger_1.default.warn('[disqus]', 'getAccessToken', error);
            return Promise.reject(error);
        });
    }
    async refreshAccessToken(refreshToken) {
        return this.disqus.refreshOAuthAccessToken(refreshToken).catch((error) => {
            logger_1.default.warn('[disqus]', 'refreshAccessToken', error);
            return Promise.reject(error);
        });
    }
    getUserInfo(accessToken) {
        return this.disqus
            .request('users/details', { access_token: accessToken })
            .then((response) => response.response)
            .catch((error) => {
            logger_1.default.warn('[disqus]', 'getUserInfo', error);
            return Promise.reject(error);
        });
    }
    makeSureThreadDetail(postID) {
        return this.disqus
            .request('threads/details', { forum: app_config_1.DISQUS.forum, thread: `link:${(0, urlmap_transformer_1.getPermalinkByID)(postID)}` })
            .then((response) => response.response)
            .catch(() => this.disqusPrivateService.createThread(postID));
    }
    async makeSureThreadDetailCache(postID) {
        const cacheKey = (0, cache_constant_1.getDisqusCacheKey)(`thread-post-${postID}`);
        const cached = await this.cacheService.get(cacheKey);
        if (cached) {
            return cached;
        }
        const result = await this.makeSureThreadDetail(postID);
        this.cacheService.set(cacheKey, result, { ttl: 60 * 60 * 24 });
        return result;
    }
    async voteThread(params) {
        return this.disqus.request('threads/vote', params, true).catch((error) => {
            logger_1.default.warn('[disqus]', 'voteThread', error);
            return Promise.reject(error);
        });
    }
    async votePost(params) {
        https: return this.disqus.request('posts/vote', params).catch((error) => {
            logger_1.default.warn('[disqus]', 'votePost', error);
            return Promise.reject(error);
        });
    }
    async getDisqusPostIDByCommentID(commentID) {
        try {
            const comment = await this.commentService.getDetailByNumberID(commentID);
            return (0, extend_transformer_1.getExtendValue)(comment.extends, DISQUS_CONST.COMMENT_POST_ID_EXTEND_KEY) || null;
        }
        catch (error) {
            return null;
        }
    }
    async createDisqusComment(payload) {
        const { comment, threadID, parentID, accessToken } = payload;
        const body = {
            message: comment.content,
            parent: parentID,
            thread: threadID,
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
            logger_1.default.warn('[disqus]', 'createDisqusComment', error);
            return Promise.reject(error);
        }));
    }
    async createUniversalComment(comment, visitor, accessToken) {
        const newComment = this.commentService.normalizeNewComment(comment, visitor);
        await this.commentService.isCommentableTarget(newComment.post_id);
        const thread = await this.makeSureThreadDetailCache(newComment.post_id);
        await this.commentService.isNotBlocklisted(newComment);
        let parentID = null;
        if (Boolean(newComment.pid)) {
            parentID = await this.getDisqusPostIDByCommentID(newComment.pid);
        }
        const disqusPost = await this.createDisqusComment({
            comment: newComment,
            threadID: thread.id,
            parentID,
            accessToken,
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
            logger_1.default.warn('[disqus]', 'deleteDisqusComment', error);
            return Promise.reject(error);
        });
    }
    async deleteUniversalComment(commentID, accessToken) {
        const comment = await this.commentService.getDetailByNumberID(commentID);
        if (!comment) {
            throw 'Comment not found';
        }
        const extendsObject = (0, extend_transformer_1.getExtendsObject)(comment.extends);
        const commentDisqusPostID = extendsObject[DISQUS_CONST.COMMENT_POST_ID_EXTEND_KEY];
        const commentDisqusAuthorID = extendsObject[DISQUS_CONST.COMMENT_AUTHOR_ID_EXTEND_KEY];
        if (!commentDisqusAuthorID || !commentDisqusPostID) {
            throw 'Comment not deleteable';
        }
        const userInfo = await this.getUserInfo(accessToken);
        if (userInfo.id !== commentDisqusAuthorID) {
            throw `You do not have write privileges on comment ${commentID}`;
        }
        await this.deleteDisqusComment({
            post: commentDisqusPostID,
            access_token: accessToken,
        });
        return await this.commentService.update(comment._id, { state: biz_interface_1.CommentState.Deleted });
    }
};
DisqusPublicService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cache_service_1.CacheService,
        comment_service_1.CommentService,
        disqus_service_private_1.DisqusPrivateService])
], DisqusPublicService);
exports.DisqusPublicService = DisqusPublicService;
//# sourceMappingURL=disqus.service.public.js.map