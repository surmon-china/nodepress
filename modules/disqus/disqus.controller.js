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
exports.DisqusController = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const event_emitter_1 = require("@nestjs/event-emitter");
const admin_only_guard_1 = require("../../guards/admin-only.guard");
const success_response_decorator_1 = require("../../decorators/success-response.decorator");
const uploaded_file_decorator_1 = require("../../decorators/uploaded-file.decorator");
const request_context_decorator_1 = require("../../decorators/request-context.decorator");
const comment_model_1 = require("../comment/comment.model");
const events_constant_1 = require("../../constants/events.constant");
const app_config_1 = require("../../app.config");
const disqus_service_public_1 = require("./disqus.service.public");
const disqus_service_private_1 = require("./disqus.service.private");
const disqus_token_1 = require("./disqus.token");
const disqus_dto_1 = require("./disqus.dto");
let DisqusController = class DisqusController {
    eventEmitter;
    disqusPublicService;
    disqusPrivateService;
    constructor(eventEmitter, disqusPublicService, disqusPrivateService) {
        this.eventEmitter = eventEmitter;
        this.disqusPublicService = disqusPublicService;
        this.disqusPrivateService = disqusPrivateService;
    }
    getConfig() {
        return {
            forum: app_config_1.DISQUS.forum,
            admin_username: app_config_1.DISQUS.adminUsername,
            public_key: app_config_1.DISQUS.publicKey,
            authorize_url: this.disqusPublicService.getAuthorizeURL()
        };
    }
    closeWindowScript(response) {
        response.type('application/javascript').send('window.close();');
    }
    async oauthCallback(query, response) {
        const accessToken = await this.disqusPublicService.getAccessToken(query.code);
        this.disqusPublicService.setUserInfoCache(accessToken.user_id, await this.disqusPublicService.getUserInfo(accessToken.access_token), accessToken.expires_in);
        response.setCookie(disqus_token_1.TOKEN_COOKIE_KEY, (0, disqus_token_1.encodeToken)(accessToken), {
            maxAge: accessToken.expires_in * 1000,
            httpOnly: true,
            secure: 'auto'
        });
        response.header('content-type', 'text/html');
        response.send(`<!DOCTYPE html><html><script src="/disqus/close-window.js"></script></html>`);
    }
    oauthLogout(token, response) {
        if (token)
            this.disqusPublicService.deleteUserInfoCache(token.user_id);
        response.clearCookie(disqus_token_1.TOKEN_COOKIE_KEY);
        response.header('content-type', 'text/plain');
        response.send('Disqus OAuth logout succeeded');
    }
    getUserInfo(token) {
        if (!token)
            throw new common_1.UnauthorizedException('You are not logged in');
        return this.disqusPublicService.getUserInfoCache(token.user_id).then((cached) => {
            return cached ?? this.disqusPublicService.getUserInfo(token.access_token);
        });
    }
    getThread(query) {
        return this.disqusPublicService.ensureThreadDetailCache(Number(query.post_id));
    }
    createComment({ visitor }, token, comment) {
        return this.disqusPublicService.createUniversalComment(comment, visitor, token?.access_token).catch((error) => {
            this.eventEmitter.emit(events_constant_1.EventKeys.CommentCreateFailed, { comment, visitor, error });
            return Promise.reject(error);
        });
    }
    deleteComment(payload, token) {
        if (!token)
            throw new common_1.UnauthorizedException('You are not logged in');
        return this.disqusPublicService.deleteUniversalComment(payload.comment_id, token.access_token);
    }
    getThreads(query) {
        return this.disqusPrivateService.getThreads(query);
    }
    getPosts(query) {
        return this.disqusPrivateService.getPosts(query);
    }
    updatePost(body) {
        return this.disqusPrivateService.updatePost(body);
    }
    updateThread(body) {
        return this.disqusPrivateService.updateThread(body);
    }
    exportXML() {
        return this.disqusPrivateService.exportXMLFromNodepress();
    }
    importXML(file) {
        if (!['application/xml', 'text/xml'].includes(file.mimetype)) {
            throw new common_1.BadRequestException('Only XML files are allowed for import');
        }
        return this.disqusPrivateService.importXMLToNodepress(file.buffer);
    }
};
exports.DisqusController = DisqusController;
__decorate([
    (0, common_2.Get)('config'),
    (0, success_response_decorator_1.SuccessResponse)('Get Disqus config succeeded'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DisqusController.prototype, "getConfig", null);
__decorate([
    (0, common_2.Get)('close-window.js'),
    __param(0, (0, common_2.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DisqusController.prototype, "closeWindowScript", null);
__decorate([
    (0, common_2.Get)('oauth-callback'),
    __param(0, (0, common_2.Query)()),
    __param(1, (0, common_2.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [disqus_dto_1.CallbackCodeDTO, Object]),
    __metadata("design:returntype", Promise)
], DisqusController.prototype, "oauthCallback", null);
__decorate([
    (0, common_2.Post)('oauth-logout'),
    __param(0, (0, disqus_token_1.DisqusToken)()),
    __param(1, (0, common_2.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], DisqusController.prototype, "oauthLogout", null);
__decorate([
    (0, common_2.Get)('user-info'),
    (0, success_response_decorator_1.SuccessResponse)('Get Disqus user info succeeded'),
    __param(0, (0, disqus_token_1.DisqusToken)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DisqusController.prototype, "getUserInfo", null);
__decorate([
    (0, common_2.Get)('thread'),
    (0, success_response_decorator_1.SuccessResponse)('Get Disqus thread info succeeded'),
    __param(0, (0, common_2.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [disqus_dto_1.ThreadPostIdDTO]),
    __metadata("design:returntype", void 0)
], DisqusController.prototype, "getThread", null);
__decorate([
    (0, common_2.Post)('comment'),
    (0, throttler_1.Throttle)({ default: { ttl: (0, throttler_1.seconds)(30), limit: 6 } }),
    (0, success_response_decorator_1.SuccessResponse)('Create universal comment succeeded'),
    __param(0, (0, request_context_decorator_1.RequestContext)()),
    __param(1, (0, disqus_token_1.DisqusToken)()),
    __param(2, (0, common_2.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, comment_model_1.CommentBase]),
    __metadata("design:returntype", void 0)
], DisqusController.prototype, "createComment", null);
__decorate([
    (0, common_2.Delete)('comment'),
    (0, success_response_decorator_1.SuccessResponse)('Delete universal comment succeeded'),
    __param(0, (0, common_2.Body)()),
    __param(1, (0, disqus_token_1.DisqusToken)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [disqus_dto_1.CommentIdDTO, Object]),
    __metadata("design:returntype", void 0)
], DisqusController.prototype, "deleteComment", null);
__decorate([
    (0, common_2.Get)('threads'),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    (0, success_response_decorator_1.SuccessResponse)('Get Disqus threads succeeded'),
    __param(0, (0, common_2.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DisqusController.prototype, "getThreads", null);
__decorate([
    (0, common_2.Get)('posts'),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    (0, success_response_decorator_1.SuccessResponse)('Get Disqus posts succeeded'),
    __param(0, (0, common_2.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DisqusController.prototype, "getPosts", null);
__decorate([
    (0, common_2.Post)('post'),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    (0, success_response_decorator_1.SuccessResponse)('Update Disqus post succeeded'),
    __param(0, (0, common_2.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DisqusController.prototype, "updatePost", null);
__decorate([
    (0, common_2.Post)('thread'),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    (0, success_response_decorator_1.SuccessResponse)('Update Disqus thread succeeded'),
    __param(0, (0, common_2.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DisqusController.prototype, "updateThread", null);
__decorate([
    (0, common_2.Get)('export-xml'),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    (0, common_2.Header)('content-type', 'application/xml'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DisqusController.prototype, "exportXML", null);
__decorate([
    (0, common_2.Post)('import-xml'),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    (0, success_response_decorator_1.SuccessResponse)('Import XML from Disqus succeeded'),
    __param(0, (0, uploaded_file_decorator_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DisqusController.prototype, "importXML", null);
exports.DisqusController = DisqusController = __decorate([
    (0, common_1.Controller)('disqus'),
    __metadata("design:paramtypes", [event_emitter_1.EventEmitter2,
        disqus_service_public_1.DisqusPublicService,
        disqus_service_private_1.DisqusPrivateService])
], DisqusController);
//# sourceMappingURL=disqus.controller.js.map