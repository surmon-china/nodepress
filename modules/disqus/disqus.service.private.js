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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisqusPrivateService = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const fast_xml_parser_1 = require("fast-xml-parser");
const common_1 = require("@nestjs/common");
const article_service_1 = require("../article/article.service");
const comment_service_1 = require("../comment/comment.service");
const biz_constant_1 = require("../../constants/biz.constant");
const extend_transformer_1 = require("../../transformers/extend.transformer");
const urlmap_transformer_1 = require("../../transformers/urlmap.transformer");
const app_config_1 = require("../../app.config");
const disqus_1 = require("../../utils/disqus");
const app_environment_1 = require("../../app.environment");
const logger_1 = require("../../utils/logger");
const disqus_xml_1 = require("./disqus.xml");
const DISQUS_CONST = __importStar(require("./disqus.constant"));
const logger = (0, logger_1.createLogger)({ scope: 'DisqusPrivateService', time: app_environment_1.isDevEnv });
let DisqusPrivateService = class DisqusPrivateService {
    constructor(articleService, commentService) {
        this.articleService = articleService;
        this.commentService = commentService;
        this.disqus = new disqus_1.Disqus({
            apiKey: app_config_1.DISQUS.publicKey,
            apiSecret: app_config_1.DISQUS.secretKey
        });
    }
    async createThread(postId) {
        try {
            const article = await this.articleService.getDetailByNumberIdOrSlug({ idOrSlug: postId, publicOnly: true });
            const response = await this.disqus.request('threads/create', {
                forum: app_config_1.DISQUS.forum,
                identifier: DISQUS_CONST.getThreadIdentifierById(postId),
                title: article.title,
                message: article.description,
                slug: article.slug || DISQUS_CONST.getThreadIdentifierById(postId),
                date: (0, dayjs_1.default)(article.created_at).unix(),
                url: (0, urlmap_transformer_1.getPermalinkById)(postId),
                access_token: app_config_1.DISQUS.adminAccessToken
            });
            return response.response;
        }
        catch (error) {
            logger.warn('createThread failed!', postId, error);
            throw error;
        }
    }
    async getThreads(params) {
        return this.disqus
            .request('threads/list', Object.assign({ access_token: app_config_1.DISQUS.adminAccessToken, forum: app_config_1.DISQUS.forum }, params))
            .catch((error) => {
            logger.warn('getThreads failed!', error);
            return Promise.reject(error);
        });
    }
    async getPosts(params) {
        return this.disqus
            .request('posts/list', Object.assign({ access_token: app_config_1.DISQUS.adminAccessToken, forum: app_config_1.DISQUS.forum }, params))
            .catch((error) => {
            logger.warn('getPosts failed!', error);
            return Promise.reject(error);
        });
    }
    async updateThread(params) {
        return this.disqus
            .request('threads/update', Object.assign({ access_token: app_config_1.DISQUS.adminAccessToken }, params))
            .catch((error) => {
            logger.warn('updateThread failed!', error);
            return Promise.reject(error);
        });
    }
    async updatePost(params) {
        return this.disqus
            .request('posts/update', Object.assign({ access_token: app_config_1.DISQUS.adminAccessToken }, params))
            .catch((error) => {
            logger.warn('updatePost failed!', error);
            return Promise.reject(error);
        });
    }
    async approvePost(params) {
        return this.disqus
            .request('posts/approve', Object.assign({ access_token: app_config_1.DISQUS.adminAccessToken }, params))
            .catch((error) => {
            logger.warn('approvePost failed!', error);
            return Promise.reject(error);
        });
    }
    async exportXML() {
        const treeMap = new Map();
        const guestbook = [];
        const allComments = await this.commentService.getAll();
        const todoComments = allComments.filter((comment) => [biz_constant_1.CommentState.Auditing, biz_constant_1.CommentState.Published].includes(comment.state));
        const todoCommentIds = todoComments.map((comment) => comment.id);
        todoComments.forEach((comment) => {
            if (comment.pid && !todoCommentIds.includes(comment.pid)) {
                comment.pid = 0;
            }
            if (comment.post_id === biz_constant_1.GUESTBOOK_POST_ID) {
                guestbook.push(comment);
            }
            else if (treeMap.has(comment.post_id)) {
                treeMap.get(comment.post_id).comments.push(comment);
            }
            else {
                treeMap.set(comment.post_id, { comments: [comment] });
            }
        });
        const articleIds = Array.from(treeMap.keys());
        const articles = await this.articleService.getList(articleIds);
        articles.forEach((article) => {
            if (treeMap.has(article.id)) {
                treeMap.get(article.id).article = article;
            }
        });
        const treeList = Array.from(treeMap.values()).filter((item) => Boolean(item.article));
        return (0, disqus_xml_1.getDisqusXML)(treeList, guestbook);
    }
    async importXML(file) {
        const xml = file.buffer.toString();
        const parser = new fast_xml_parser_1.XMLParser({
            ignoreAttributes: false,
            allowBooleanAttributes: true,
            attributeNamePrefix: '@'
        });
        const object = parser.parse(xml);
        const posts = object.disqus.post;
        const filtered = posts.filter((post) => Boolean(post.id));
        const getEach = (post) => ({
            commentId: Number(post.id.replace(`wp_id=`, '')),
            postId: post['@dsq:id'],
            threadId: post.thread['@dsq:id'],
            isAnonymous: post.author.isAnonymous,
            username: post.author.username || null
        });
        const doImport = async (each) => {
            if (!Number.isFinite(each.commentId)) {
                throw `Invalid comment ID '${each.commentId}'`;
            }
            const comment = await this.commentService.getDetailByNumberId(each.commentId);
            if (!comment) {
                throw `Invalid comment '${comment}'`;
            }
            const _extends = comment.extends || [];
            const extendsObject = (0, extend_transformer_1.getExtendObject)(_extends);
            if (!extendsObject[DISQUS_CONST.COMMENT_POST_ID_EXTEND_KEY]) {
                _extends.push({ name: DISQUS_CONST.COMMENT_POST_ID_EXTEND_KEY, value: each.postId });
            }
            if (!extendsObject[DISQUS_CONST.COMMENT_THREAD_ID_EXTEND_KEY]) {
                _extends.push({ name: DISQUS_CONST.COMMENT_THREAD_ID_EXTEND_KEY, value: each.threadId });
            }
            if (each.isAnonymous) {
                if (!extendsObject[DISQUS_CONST.COMMENT_ANONYMOUS_EXTEND_KEY]) {
                    _extends.push({ name: DISQUS_CONST.COMMENT_ANONYMOUS_EXTEND_KEY, value: 'true' });
                }
            }
            else if (each.username) {
                if (!extendsObject[DISQUS_CONST.COMMENT_AUTHOR_USERNAME_EXTEND_KEY]) {
                    _extends.push({ name: DISQUS_CONST.COMMENT_AUTHOR_USERNAME_EXTEND_KEY, value: each.username });
                }
            }
            comment.extends = _extends;
            return await comment.save();
        };
        const done = [];
        const fail = [];
        for (const post of filtered) {
            const each = getEach(post);
            try {
                await doImport(each);
                done.push(each);
            }
            catch (error) {
                fail.push(each);
            }
        }
        logger.info('import XML', { done: done.length, fail: fail.length });
        return { done, fail };
    }
};
exports.DisqusPrivateService = DisqusPrivateService;
exports.DisqusPrivateService = DisqusPrivateService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [article_service_1.ArticleService,
        comment_service_1.CommentService])
], DisqusPrivateService);
//# sourceMappingURL=disqus.service.private.js.map