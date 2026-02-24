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
exports.AccountController = void 0;
const throttler_1 = require("@nestjs/throttler");
const common_1 = require("@nestjs/common");
const helper_service_email_1 = require("../../core/helper/helper.service.email");
const only_identity_decorator_1 = require("../../decorators/only-identity.decorator");
const request_context_decorator_1 = require("../../decorators/request-context.decorator");
const success_response_decorator_1 = require("../../decorators/success-response.decorator");
const email_transformer_1 = require("../../transformers/email.transformer");
const app_config_1 = require("../../app.config");
const user_service_1 = require("../user/user.service");
const user_constant_1 = require("../user/user.constant");
const account_service_identity_1 = require("./account.service.identity");
const account_service_activity_1 = require("./account.service.activity");
const account_dto_1 = require("./account.dto");
let AccountController = class AccountController {
    emailService;
    userService;
    accountIdentityService;
    accountActivityService;
    constructor(emailService, userService, accountIdentityService, accountActivityService) {
        this.emailService = emailService;
        this.userService = userService;
        this.accountIdentityService = accountIdentityService;
        this.accountActivityService = accountActivityService;
    }
    getProfile({ identity }) {
        return this.userService.findOne(identity.payload.uid);
    }
    updateProfile({ identity }, dto) {
        return this.userService.update(identity.payload.uid, {
            name: dto.name,
            email: dto.email,
            website: dto.website,
            avatar_url: dto.avatar_url
        });
    }
    unlinkIdentity({ identity }, provider) {
        return this.accountIdentityService.removeIdentity(identity.payload.uid, provider);
    }
    async requestDestroyAccount({ identity }, { delete_comments }) {
        const user = await this.userService.findOne(identity.payload.uid);
        this.emailService.sendMailAs(app_config_1.APP_BIZ.NAME, {
            to: app_config_1.APP_BIZ.ADMIN_EMAIL,
            subject: `Account Destruction Request - ${user.name} (#${user.id})`,
            ...(0, email_transformer_1.linesToEmailContent)([
                `Target: [${user.name}] requested to destroy their account.`,
                ``,
                `User ID: ${user.id}`,
                `User Name: ${user.name}`,
                `User Email: ${user.email ?? 'N/A'}`,
                `User Website: ${user.website ?? 'N/A'}`,
                `Identities: ${user.identities.map((id) => id.provider).join(', ')}`,
                `Comment Strategy: ${delete_comments ? 'Delete all comments' : 'Keep comments data (Anonymized)'}`,
                ``,
                `Request Time: ${new Date().toLocaleString()}`,
                `Action Required: Please manually verify and perform the deletion in the database.`
            ])
        });
    }
    async getUsersAllVotes({ identity }) {
        const user = await this.userService.findOne(identity.payload.uid);
        return await this.accountActivityService.getAllVotes(user._id);
    }
    async getUsersAllComments({ identity }) {
        const user = await this.userService.findOne(identity.payload.uid);
        return await this.accountActivityService.getAllPublicComments(user._id);
    }
    async deleteUsersComment(id, { identity }) {
        const user = await this.userService.findOne(identity.payload.uid);
        return await this.accountActivityService.deleteComment(user._id, id);
    }
};
exports.AccountController = AccountController;
__decorate([
    (0, common_1.Get)('profile'),
    (0, success_response_decorator_1.SuccessResponse)('Get profile succeeded'),
    __param(0, (0, request_context_decorator_1.RequestContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AccountController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Patch)('profile'),
    (0, success_response_decorator_1.SuccessResponse)('Update profile succeeded'),
    __param(0, (0, request_context_decorator_1.RequestContext)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, account_dto_1.UpdateProfileDto]),
    __metadata("design:returntype", void 0)
], AccountController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Delete)('identities/:provider'),
    (0, success_response_decorator_1.SuccessResponse)('Unlink identity succeeded'),
    __param(0, (0, request_context_decorator_1.RequestContext)()),
    __param(1, (0, common_1.Param)('provider')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AccountController.prototype, "unlinkIdentity", null);
__decorate([
    (0, common_1.Post)('deletion-request'),
    (0, throttler_1.Throttle)({ default: { ttl: (0, throttler_1.hours)(1), limit: 5 } }),
    __param(0, (0, request_context_decorator_1.RequestContext)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, account_dto_1.DeletionRequestDto]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "requestDestroyAccount", null);
__decorate([
    (0, common_1.Get)('votes'),
    (0, success_response_decorator_1.SuccessResponse)('Get votes succeeded'),
    __param(0, (0, request_context_decorator_1.RequestContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "getUsersAllVotes", null);
__decorate([
    (0, common_1.Get)('comments'),
    (0, success_response_decorator_1.SuccessResponse)('Get comments succeeded'),
    __param(0, (0, request_context_decorator_1.RequestContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "getUsersAllComments", null);
__decorate([
    (0, common_1.Delete)('comments/:id'),
    (0, success_response_decorator_1.SuccessResponse)('Delete comment succeeded'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, request_context_decorator_1.RequestContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "deleteUsersComment", null);
exports.AccountController = AccountController = __decorate([
    (0, common_1.Controller)('account'),
    (0, only_identity_decorator_1.OnlyIdentity)(only_identity_decorator_1.IdentityRole.User),
    __metadata("design:paramtypes", [helper_service_email_1.EmailService,
        user_service_1.UserService,
        account_service_identity_1.AccountIdentityService,
        account_service_activity_1.AccountActivityService])
], AccountController);
//# sourceMappingURL=account.controller.js.map