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
exports.GithubAuthService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const logger_1 = require("../../../utils/logger");
const app_environment_1 = require("../../../app.environment");
const app_config_1 = require("../../../app.config");
const user_constant_1 = require("../../user/user.constant");
const logger = (0, logger_1.createLogger)({ scope: 'GithubAuthService', time: app_environment_1.isDevEnv });
let GithubAuthService = class GithubAuthService {
    httpService;
    constructor(httpService) {
        this.httpService = httpService;
    }
    async getAuthorizeURL(callbackPath, state) {
        const redirectUri = app_environment_1.isProdEnv
            ? `${app_config_1.APP_BIZ.URL}${callbackPath}`
            : `http://localhost:${app_config_1.APP_BIZ.PORT}${callbackPath}`;
        const url = new URL('https://github.com/login/oauth/authorize');
        url.searchParams.set('client_id', app_config_1.GITHUB_OAUTH.clientId);
        url.searchParams.set('redirect_uri', redirectUri);
        url.searchParams.set('state', state);
        url.searchParams.set('scope', app_config_1.GITHUB_OAUTH.scope);
        return url.toString();
    }
    async getAccessTokenByCode(code) {
        const api = 'https://github.com/login/oauth/access_token';
        const data = {
            client_id: app_config_1.GITHUB_OAUTH.clientId,
            client_secret: app_config_1.GITHUB_OAUTH.clientSecret,
            code
        };
        return this.httpService.axiosRef
            .post(api, data, { headers: { Accept: 'application/json' } })
            .then((response) => response.data.access_token)
            .catch((error) => {
            logger.error('Failed to fetch AccessToken:', error);
            throw new common_1.UnauthorizedException('GitHub authentication failed. Please try again later.');
        });
    }
    getUserInfoByToken(accessToken) {
        return this.httpService.axiosRef
            .get('https://api.github.com/user', { headers: { Authorization: `Bearer ${accessToken}` } })
            .then((response) => response.data)
            .catch((error) => {
            logger.error('Failed to fetch GitHub user info:', error);
            throw new common_1.UnauthorizedException('Failed to retrieve GitHub profile. Please re-authenticate.');
        });
    }
    transformUserInfoToIdentity(userInfo) {
        return {
            provider: user_constant_1.UserIdentityProvider.GitHub,
            uid: String(userInfo.id),
            email: userInfo.email,
            username: userInfo.login,
            display_name: userInfo.name,
            avatar_url: userInfo.avatar_url,
            profile_url: userInfo.blog
        };
    }
};
exports.GithubAuthService = GithubAuthService;
exports.GithubAuthService = GithubAuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], GithubAuthService);
//# sourceMappingURL=auth.service.github.js.map