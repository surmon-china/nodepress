"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleAuthService = void 0;
const google_auth_library_1 = require("google-auth-library");
const common_1 = require("@nestjs/common");
const logger_1 = require("../../../utils/logger");
const app_environment_1 = require("../../../app.environment");
const app_config_1 = require("../../../app.config");
const user_constant_1 = require("../../user/user.constant");
const logger = (0, logger_1.createLogger)({ scope: 'GoogleAuthService', time: app_environment_1.isDevEnv });
let GoogleAuthService = class GoogleAuthService {
    createClient(callbackPath) {
        const redirectUri = app_environment_1.isProdEnv
            ? `${app_config_1.APP_BIZ.URL}${callbackPath}`
            : `http://localhost:${app_config_1.APP_BIZ.PORT}${callbackPath}`;
        return new google_auth_library_1.OAuth2Client({
            client_id: app_config_1.GOOGLE_OAUTH.clientId,
            client_secret: app_config_1.GOOGLE_OAUTH.clientSecret,
            redirect_uris: [redirectUri]
        });
    }
    getAuthorizeURL(callbackPath, state) {
        return this.createClient(callbackPath).generateAuthUrl({
            access_type: 'offline',
            scope: app_config_1.GOOGLE_OAUTH.scope,
            state
        });
    }
    async getUserInfoByCode(callbackPath, code) {
        const client = this.createClient(callbackPath);
        const { tokens } = await client.getToken(code);
        client.setCredentials(tokens);
        const response = await client.request({
            url: 'https://www.googleapis.com/oauth2/v3/userinfo'
        });
        return response.data;
    }
    transformUserInfoToIdentity(userInfo) {
        return {
            provider: user_constant_1.UserIdentityProvider.Google,
            uid: userInfo.sub,
            email: userInfo.email,
            username: null,
            display_name: userInfo.name,
            avatar_url: userInfo.picture,
            profile_url: null
        };
    }
};
exports.GoogleAuthService = GoogleAuthService;
exports.GoogleAuthService = GoogleAuthService = __decorate([
    (0, common_1.Injectable)()
], GoogleAuthService);
//# sourceMappingURL=auth.service.google.js.map