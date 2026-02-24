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
exports.AccountAuthController = void 0;
const throttler_1 = require("@nestjs/throttler");
const common_1 = require("@nestjs/common");
const request_context_decorator_1 = require("../../../decorators/request-context.decorator");
const success_response_decorator_1 = require("../../../decorators/success-response.decorator");
const only_identity_decorator_1 = require("../../../decorators/only-identity.decorator");
const response_interface_1 = require("../../../interfaces/response.interface");
const error_transformer_1 = require("../../../transformers/error.transformer");
const account_service_identity_1 = require("../account.service.identity");
const auth_service_state_1 = require("./auth.service.state");
const auth_service_token_1 = require("./auth.service.token");
const auth_service_github_1 = require("./auth.service.github");
const auth_service_google_1 = require("./auth.service.google");
const auth_dto_1 = require("./auth.dto");
const auth_helper_1 = require("./auth.helper");
const GITHUB_CALLBACK_PATH = '/account/auth/github/callback';
const GOOGLE_CALLBACK_PATH = '/account/auth/google/callback';
let AccountAuthController = class AccountAuthController {
    accountIdentityService;
    authTokenService;
    authStateService;
    googleAuthService;
    githubAuthService;
    constructor(accountIdentityService, authTokenService, authStateService, googleAuthService, githubAuthService) {
        this.accountIdentityService = accountIdentityService;
        this.authTokenService = authTokenService;
        this.authStateService = authStateService;
        this.googleAuthService = googleAuthService;
        this.githubAuthService = githubAuthService;
    }
    async githubLink({ identity }) {
        const payload = { intent: auth_service_state_1.AuthIntent.Link, uid: identity.payload.uid };
        const state = await this.authStateService.generateCallbackState(payload);
        const authorizeUrl = await this.githubAuthService.getAuthorizeURL(GITHUB_CALLBACK_PATH, state);
        return { url: authorizeUrl };
    }
    async githubLogin() {
        const state = await this.authStateService.generateCallbackState({ intent: auth_service_state_1.AuthIntent.Login });
        const authorizeUrl = await this.githubAuthService.getAuthorizeURL(GITHUB_CALLBACK_PATH, state);
        return { url: authorizeUrl };
    }
    async githubOAuthCallback({ code, state }, response) {
        try {
            const statePayload = await this.authStateService.verifyCallbackState(state);
            const accessToken = await this.githubAuthService.getAccessTokenByCode(code);
            const userInfo = await this.githubAuthService.getUserInfoByToken(accessToken);
            const userIdentity = this.githubAuthService.transformUserInfoToIdentity(userInfo);
            const message = await this.resolveOAuthIntent(statePayload, userIdentity);
            (0, auth_helper_1.sendWindowPostMessage)(response, {
                status: response_interface_1.ResponseStatus.Success,
                ...message
            });
        }
        catch (error) {
            (0, auth_helper_1.sendWindowPostMessage)(response, {
                status: response_interface_1.ResponseStatus.Error,
                error: (0, error_transformer_1.getMessageFromNormalError)(error)
            });
        }
    }
    async googleLink({ identity }) {
        const payload = { intent: auth_service_state_1.AuthIntent.Link, uid: identity.payload.uid };
        const state = await this.authStateService.generateCallbackState(payload);
        const authorizeUrl = await this.googleAuthService.getAuthorizeURL(GOOGLE_CALLBACK_PATH, state);
        return { url: authorizeUrl };
    }
    async googleLogin() {
        const state = await this.authStateService.generateCallbackState({ intent: auth_service_state_1.AuthIntent.Login });
        const authorizeUrl = await this.googleAuthService.getAuthorizeURL(GOOGLE_CALLBACK_PATH, state);
        return { url: authorizeUrl };
    }
    async googleOAuthCallback({ code, state }, response) {
        try {
            const statePayload = await this.authStateService.verifyCallbackState(state);
            const userInfo = await this.googleAuthService.getUserInfoByCode(GOOGLE_CALLBACK_PATH, code);
            const userIdentity = this.googleAuthService.transformUserInfoToIdentity(userInfo);
            const message = await this.resolveOAuthIntent(statePayload, userIdentity);
            (0, auth_helper_1.sendWindowPostMessage)(response, {
                status: response_interface_1.ResponseStatus.Success,
                ...message
            });
        }
        catch (error) {
            (0, auth_helper_1.sendWindowPostMessage)(response, {
                status: response_interface_1.ResponseStatus.Error,
                error: (0, error_transformer_1.getMessageFromNormalError)(error)
            });
        }
    }
    async resolveOAuthIntent(statePayload, userIdentity) {
        switch (statePayload.intent) {
            case auth_service_state_1.AuthIntent.Login: {
                const user = await this.accountIdentityService.upsertUser(userIdentity);
                const token = this.authTokenService.createToken(user);
                return { type: auth_service_state_1.AuthIntent.Login, token };
            }
            case auth_service_state_1.AuthIntent.Link: {
                await this.accountIdentityService.addIdentity(statePayload.uid, userIdentity);
                return { type: auth_service_state_1.AuthIntent.Link };
            }
            default:
                throw new common_1.BadRequestException('Invalid OAuth intent');
        }
    }
    async logout({ identity }) {
        await this.authTokenService.invalidateToken(identity.token);
        return 'ok';
    }
};
exports.AccountAuthController = AccountAuthController;
__decorate([
    (0, common_1.Get)('github/link'),
    (0, only_identity_decorator_1.OnlyIdentity)(only_identity_decorator_1.IdentityRole.User),
    (0, throttler_1.Throttle)({ default: { ttl: (0, throttler_1.minutes)(1), limit: 10 } }),
    (0, success_response_decorator_1.SuccessResponse)('Get GitHub link URL succeeded'),
    __param(0, (0, request_context_decorator_1.RequestContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccountAuthController.prototype, "githubLink", null);
__decorate([
    (0, common_1.Get)('github/login'),
    (0, throttler_1.Throttle)({ default: { ttl: (0, throttler_1.minutes)(1), limit: 10 } }),
    (0, success_response_decorator_1.SuccessResponse)('Get GitHub login URL succeeded'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AccountAuthController.prototype, "githubLogin", null);
__decorate([
    (0, common_1.Get)('github/callback'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.OAuthCallbackDto, Object]),
    __metadata("design:returntype", Promise)
], AccountAuthController.prototype, "githubOAuthCallback", null);
__decorate([
    (0, common_1.Get)('google/link'),
    (0, only_identity_decorator_1.OnlyIdentity)(only_identity_decorator_1.IdentityRole.User),
    (0, throttler_1.Throttle)({ default: { ttl: (0, throttler_1.minutes)(1), limit: 10 } }),
    (0, success_response_decorator_1.SuccessResponse)('Get Google link URL succeeded'),
    __param(0, (0, request_context_decorator_1.RequestContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccountAuthController.prototype, "googleLink", null);
__decorate([
    (0, common_1.Get)('google/login'),
    (0, throttler_1.Throttle)({ default: { ttl: (0, throttler_1.minutes)(1), limit: 10 } }),
    (0, success_response_decorator_1.SuccessResponse)('Get Google login URL succeeded'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AccountAuthController.prototype, "googleLogin", null);
__decorate([
    (0, common_1.Get)('google/callback'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.OAuthCallbackDto, Object]),
    __metadata("design:returntype", Promise)
], AccountAuthController.prototype, "googleOAuthCallback", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, only_identity_decorator_1.OnlyIdentity)(only_identity_decorator_1.IdentityRole.User),
    (0, success_response_decorator_1.SuccessResponse)('Logout succeeded'),
    __param(0, (0, request_context_decorator_1.RequestContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccountAuthController.prototype, "logout", null);
exports.AccountAuthController = AccountAuthController = __decorate([
    (0, common_1.Controller)('account/auth'),
    __metadata("design:paramtypes", [account_service_identity_1.AccountIdentityService,
        auth_service_token_1.UserAuthTokenService,
        auth_service_state_1.UserAuthStateService,
        auth_service_google_1.GoogleAuthService,
        auth_service_github_1.GithubAuthService])
], AccountAuthController);
//# sourceMappingURL=auth.controller.js.map