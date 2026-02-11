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
const comment_constant_1 = require("../comment/comment.constant");
const extras_constant_1 = require("../../constants/extras.constant");
const biz_constant_1 = require("../../constants/biz.constant");
const extra_transformer_1 = require("../../transformers/extra.transformer");
const urlmap_transformer_1 = require("../../transformers/urlmap.transformer");
const app_config_1 = require("../../app.config");
const disqus_1 = require("../../utils/disqus");
const app_environment_1 = require("../../app.environment");
const logger_1 = require("../../utils/logger");
const disqus_helper_1 = require("./disqus.helper");
const disqus_xml_1 = require("./disqus.xml");
const logger = (0, logger_1.createLogger)({ scope: 'DisqusPrivateService', time: app_environment_1.isDevEnv });
let DisqusPrivateService = class DisqusPrivateService {
    articleService;
    commentService;
    disqus;
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
            const article = await this.articleService.getDetailByNumberIdOrSlug({
                numberId: postId,
                publicOnly: true,
                lean: true
            });
            const response = await this.disqus.request('threads/create', {
                forum: app_config_1.DISQUS.forum,
                identifier: (0, disqus_helper_1.getThreadIdentifierById)(postId),
                title: article.title,
                message: article.summary,
                slug: article.slug || (0, disqus_helper_1.getThreadIdentifierById)(postId),
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
            .request('threads/list', {
            access_token: app_config_1.DISQUS.adminAccessToken,
            forum: app_config_1.DISQUS.forum,
            ...params
        })
            .catch((error) => {
            logger.warn('getThreads failed!', error);
            return Promise.reject(error);
        });
    }
    async getPosts(params) {
        return this.disqus
            .request('posts/list', {
            access_token: app_config_1.DISQUS.adminAccessToken,
            forum: app_config_1.DISQUS.forum,
            ...params
        })
            .catch((error) => {
            logger.warn('getPosts failed!', error);
            return Promise.reject(error);
        });
    }
    async updateThread(params) {
        return this.disqus
            .request('threads/update', {
            access_token: app_config_1.DISQUS.adminAccessToken,
            ...params
        })
            .catch((error) => {
            logger.warn('updateThread failed!', error);
            return Promise.reject(error);
        });
    }
    async updatePost(params) {
        return this.disqus
            .request('posts/update', {
            access_token: app_config_1.DISQUS.adminAccessToken,
            ...params
        })
            .catch((error) => {
            logger.warn('updatePost failed!', error);
            return Promise.reject(error);
        });
    }
    async approvePost(params) {
        return this.disqus
            .request('posts/approve', {
            access_token: app_config_1.DISQUS.adminAccessToken,
            ...params
        })
            .catch((error) => {
            logger.warn('approvePost failed!', error);
            return Promise.reject(error);
        });
    }
    async exportXMLFromNodepress() {
        const treeMap = new Map();
        const guestbook = [];
        const allComments = await this.commentService.getAll();
        const todoComments = allComments.filter((comment) => [comment_constant_1.CommentStatus.Pending, comment_constant_1.CommentStatus.Published].includes(comment.status));
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
    async importXMLToNodepress(xmlFileBuffer) {
        const parser = new fast_xml_parser_1.XMLParser({
            ignoreAttributes: false,
            allowBooleanAttributes: true,
            attributeNamePrefix: '@'
        });
        const object = parser.parse(xmlFileBuffer);
        const posts = object?.disqus?.post;
        if (!posts || !Array.isArray(posts)) {
            throw new common_1.BadRequestException('Invalid XML format: missing disqus.post');
        }
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
            const _extras = comment.extras || [];
            (0, extra_transformer_1.ensureExtra)(_extras, extras_constant_1.CommentDisqusExtraKeys.PostId, each.postId);
            (0, extra_transformer_1.ensureExtra)(_extras, extras_constant_1.CommentDisqusExtraKeys.ThreadId, each.threadId);
            if (each.isAnonymous) {
                (0, extra_transformer_1.ensureExtra)(_extras, extras_constant_1.CommentDisqusExtraKeys.Anonymous, 'true');
            }
            else if (each.username) {
                (0, extra_transformer_1.ensureExtra)(_extras, extras_constant_1.CommentDisqusExtraKeys.AuthorUsername, each.username);
            }
            comment.extras = _extras;
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