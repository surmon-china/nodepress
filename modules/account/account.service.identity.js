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
exports.AccountIdentityService = void 0;
const common_1 = require("@nestjs/common");
const logger_1 = require("../../utils/logger");
const app_environment_1 = require("../../app.environment");
const user_constant_1 = require("../user/user.constant");
const user_service_1 = require("../user/user.service");
const logger = (0, logger_1.createLogger)({ scope: 'AccountIdentityService', time: app_environment_1.isDevEnv });
let AccountIdentityService = class AccountIdentityService {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    async upsertUser(input) {
        const user = await this.userService.findOneByIdentity(input.provider, input.uid);
        if (user)
            return user;
        return await this.userService.create({
            type: user_constant_1.UserType.Standard,
            name: input.display_name ?? '',
            email: input.email,
            website: input.profile_url,
            avatar_url: input.avatar_url,
            extras: [],
            identities: [
                {
                    provider: input.provider,
                    uid: input.uid,
                    email: input.email,
                    username: input.username,
                    display_name: input.display_name,
                    avatar_url: input.avatar_url,
                    profile_url: input.profile_url,
                    linked_at: new Date()
                }
            ]
        });
    }
    async addIdentity(userId, identity) {
        const existingUser = await this.userService.findOneByIdentity(identity.provider, identity.uid);
        if (existingUser) {
            if (existingUser.id !== userId) {
                throw new common_1.ConflictException('This social account has already been linked to another user.');
            }
            else {
                return;
            }
        }
        const result = await this.userService.pushIdentity(userId, identity);
        if (result.matchedCount === 0) {
            throw new common_1.BadRequestException(`Your account is already linked to a ${identity.provider} identity.`);
        }
        return result;
    }
    async removeIdentity(userId, provider) {
        const targetUser = await this.userService.findOne(userId);
        if (targetUser.identities.length <= 1) {
            throw new common_1.BadRequestException('At least one authentication method is required.');
        }
        return await this.userService.pullIdentity(userId, provider);
    }
};
exports.AccountIdentityService = AccountIdentityService;
exports.AccountIdentityService = AccountIdentityService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService])
], AccountIdentityService);
//# sourceMappingURL=account.service.identity.js.map