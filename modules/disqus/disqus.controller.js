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
const platform_express_1 = require("@nestjs/platform-express");
const throttler_1 = require("@nestjs/throttler");
const app_environment_1 = require("../../app.environment");
const admin_only_guard_1 = require("../../guards/admin-only.guard");
const responser_decorator_1 = require("../../decorators/responser.decorator");
const queryparams_decorator_1 = require("../../decorators/queryparams.decorator");
const comment_model_1 = require("../comment/comment.model");
const app_config_1 = require("../../app.config");
const disqus_service_public_1 = require("./disqus.service.public");
const disqus_service_private_1 = require("./disqus.service.private");
const disqus_token_1 = require("./disqus.token");
const disqus_dto_1 = require("./disqus.dto");
let DisqusController = exports.DisqusController = class DisqusController {
    constructor(disqusPublicService, disqusPrivateService) {
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
    async oauthCallback(query, response) {
        const accessToken = await this.disqusPublicService.getAccessToken(query.code);
        this.disqusPublicService.setUserInfoCache(accessToken.user_id, await this.disqusPublicService.getUserInfo(accessToken.access_token), accessToken.expires_in);
        response.cookie(disqus_token_1.TOKEN_COOKIE_KEY, (0, disqus_token_1.encodeToken)(accessToken), {
            maxAge: accessToken.expires_in * 1000,
            httpOnly: true,
            secure: app_environment_1.isProdEnv
        });
        response.send(`<script>window.close();</script>`);
    }
    oauthLogout(token, response) {
        if (token) {
            this.disqusPublicService.deleteUserInfoCache(token.user_id);
        }
        response.clearCookie(disqus_token_1.TOKEN_COOKIE_KEY);
        response.send('ok');
    }
    getUserInfo(token) {
        if (!token) {
            return Promise.reject(`You are not logged in`);
        }
        return this.disqusPublicService.getUserInfoCache(token.user_id).then((cached) => {
            return cached || this.disqusPublicService.getUserInfo(token.access_token);
        });
    }
    getThread(query) {
        return this.disqusPublicService.ensureThreadDetailCache(Number(query.post_id));
    }
    createComment({ visitor }, token, comment) {
        return this.disqusPublicService.createUniversalComment(comment, visitor, token === null || token === void 0 ? void 0 : token.access_token);
    }
    deleteComment(payload, token) {
        return token
            ? this.disqusPublicService.deleteUniversalComment(payload.comment_id, token.access_token)
            : Promise.reject(`You are not logged in`);
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
    exportXML(response) {
        return this.disqusPrivateService.exportXML().then((xml) => {
            response.header('Content-Type', 'application/xml');
            response.send(xml);
        });
    }
    importXML(file) {
        return this.disqusPrivateService.importXML(file);
    }
};
__decorate([
    (0, common_1.Get)('config'),
    responser_decorator_1.Responser.handle('Get Disqus config'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DisqusController.prototype, "getConfig", null);
__decorate([
    (0, common_1.Get)('oauth-callback'),
    (0, common_1.Header)('content-type', 'text/html'),
    (0, common_1.Header)('Content-Security-Policy', "script-src 'unsafe-inline'"),
    responser_decorator_1.Responser.handle('Disqus OAuth login'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [disqus_dto_1.CallbackCodeDTO, Object]),
    __metadata("design:returntype", Promise)
], DisqusController.prototype, "oauthCallback", null);
__decorate([
    (0, common_1.Get)('oauth-logout'),
    (0, common_1.Header)('content-type', 'text/plain'),
    responser_decorator_1.Responser.handle('Disqus OAuth logout'),
    __param(0, (0, disqus_token_1.DisqusToken)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], DisqusController.prototype, "oauthLogout", null);
__decorate([
    (0, common_1.Get)('user-info'),
    responser_decorator_1.Responser.handle('Get Disqus user info'),
    __param(0, (0, disqus_token_1.DisqusToken)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DisqusController.prototype, "getUserInfo", null);
__decorate([
    (0, common_1.Get)('thread'),
    responser_decorator_1.Responser.handle('Get Disqus thread info'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [disqus_dto_1.ThreadPostIdDTO]),
    __metadata("design:returntype", void 0)
], DisqusController.prototype, "getThread", null);
__decorate([
    (0, common_1.Post)('comment'),
    (0, throttler_1.Throttle)(6, 30),
    responser_decorator_1.Responser.handle('Create universal comment'),
    __param(0, (0, queryparams_decorator_1.QueryParams)()),
    __param(1, (0, disqus_token_1.DisqusToken)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, comment_model_1.CommentBase]),
    __metadata("design:returntype", void 0)
], DisqusController.prototype, "createComment", null);
__decorate([
    (0, common_1.Delete)('comment'),
    responser_decorator_1.Responser.handle('Delete universal comment'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, disqus_token_1.DisqusToken)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [disqus_dto_1.CommentIdDTO, Object]),
    __metadata("design:returntype", void 0)
], DisqusController.prototype, "deleteComment", null);
__decorate([
    (0, common_1.Get)('threads'),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    responser_decorator_1.Responser.handle('Get Disqus threads'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DisqusController.prototype, "getThreads", null);
__decorate([
    (0, common_1.Get)('posts'),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    responser_decorator_1.Responser.handle('Get Disqus posts'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DisqusController.prototype, "getPosts", null);
__decorate([
    (0, common_1.Post)('post'),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    responser_decorator_1.Responser.handle('Update Disqus post'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DisqusController.prototype, "updatePost", null);
__decorate([
    (0, common_1.Post)('thread'),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    responser_decorator_1.Responser.handle('Update Disqus thread'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DisqusController.prototype, "updateThread", null);
__decorate([
    (0, common_1.Get)('export-xml'),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    responser_decorator_1.Responser.handle('Export XML for Disqus import'),
    __param(0, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DisqusController.prototype, "exportXML", null);
__decorate([
    (0, common_1.Post)('import-xml'),
    (0, common_1.UseGuards)(admin_only_guard_1.AdminOnlyGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    responser_decorator_1.Responser.handle('Import XML from Disqus'),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DisqusController.prototype, "importXML", null);
exports.DisqusController = DisqusController = __decorate([
    (0, common_1.Controller)('disqus'),
    __metadata("design:paramtypes", [disqus_service_public_1.DisqusPublicService,
        disqus_service_private_1.DisqusPrivateService])
], DisqusController);
//# sourceMappingURL=disqus.controller.js.map