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
exports.CommentAkismetService = void 0;
const akismet_api_1 = require("akismet-api");
const common_1 = require("@nestjs/common");
const urlmap_transformer_1 = require("../../transformers/urlmap.transformer");
const logger_1 = require("../../utils/logger");
const app_environment_1 = require("../../app.environment");
const app_config_1 = require("../../app.config");
const logger = (0, logger_1.createLogger)({ scope: 'CommentAkismetService', time: app_environment_1.isDevEnv });
let CommentAkismetService = class CommentAkismetService {
    client;
    isAvailable = false;
    constructor() {
        this.client = new akismet_api_1.AkismetClient({
            key: app_config_1.AKISMET.apiKey,
            blog: app_config_1.AKISMET.blog
        });
    }
    async onModuleInit() {
        try {
            this.isAvailable = await this.client.verifyKey();
            if (this.isAvailable) {
                logger.success('Client initialized.');
            }
            else {
                logger.failure('Invalid Akismet key, service unavailable.');
            }
        }
        catch (error) {
            this.isAvailable = false;
            logger.failure('Initialization failed!', error);
        }
    }
    async checkSpam(payload) {
        if (!this.isAvailable) {
            logger.warn('checkSpam skipped: Akismet service unavailable.');
            return false;
        }
        try {
            return await this.client.checkSpam(payload);
        }
        catch (error) {
            logger.error('checkSpam failed, default to HAM (Fail-open).', error);
            return false;
        }
    }
    async submitSpam(payload) {
        if (this.isAvailable) {
            try {
                await this.client.submitSpam(payload);
                logger.info('Spam reported!');
            }
            catch (error) {
                logger.error('submitSpam failed!', error);
            }
        }
    }
    async submitHam(payload) {
        if (this.isAvailable) {
            try {
                await this.client.submitHam(payload);
                logger.info('Non-spam reported!');
            }
            catch (error) {
                logger.error('submitHam failed!', error);
            }
        }
    }
    transformCommentToAkismet(comment, referer) {
        return {
            user_ip: comment.ip,
            user_agent: comment.user_agent,
            referrer: referer || '',
            permalink: (0, urlmap_transformer_1.getPermalink)(comment.target_type, comment.target_id),
            comment_type: comment.parent_id ? 'reply' : 'comment',
            comment_author: comment.author_name,
            comment_author_email: comment.author_email ?? void 0,
            comment_author_url: comment.author_website ?? void 0,
            comment_content: comment.content
        };
    }
};
exports.CommentAkismetService = CommentAkismetService;
exports.CommentAkismetService = CommentAkismetService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], CommentAkismetService);
//# sourceMappingURL=comment.service.akismet.js.map