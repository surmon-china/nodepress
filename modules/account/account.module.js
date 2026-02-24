"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountModule = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const user_module_1 = require("../user/user.module");
const vote_model_1 = require("../vote/vote.model");
const comment_model_1 = require("../comment/comment.model");
const auth_controller_1 = require("./auth/auth.controller");
const auth_service_token_1 = require("./auth/auth.service.token");
const auth_service_state_1 = require("./auth/auth.service.state");
const auth_service_github_1 = require("./auth/auth.service.github");
const auth_service_google_1 = require("./auth/auth.service.google");
const account_controller_1 = require("./account.controller");
const account_service_identity_1 = require("./account.service.identity");
const account_service_activity_1 = require("./account.service.activity");
let AccountModule = class AccountModule {
};
exports.AccountModule = AccountModule;
exports.AccountModule = AccountModule = __decorate([
    (0, common_1.Module)({
        imports: [axios_1.HttpModule, user_module_1.UserModule],
        controllers: [account_controller_1.AccountController, auth_controller_1.AccountAuthController],
        providers: [
            comment_model_1.CommentProvider,
            vote_model_1.VoteProvider,
            account_service_identity_1.AccountIdentityService,
            account_service_activity_1.AccountActivityService,
            auth_service_token_1.UserAuthTokenService,
            auth_service_state_1.UserAuthStateService,
            auth_service_github_1.GithubAuthService,
            auth_service_google_1.GoogleAuthService
        ]
    })
], AccountModule);
//# sourceMappingURL=account.module.js.map