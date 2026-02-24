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
exports.CommentBlocklistService = void 0;
const common_1 = require("@nestjs/common");
const options_service_1 = require("../options/options.service");
const logger_1 = require("../../utils/logger");
const app_environment_1 = require("../../app.environment");
const comment_constant_1 = require("./comment.constant");
const logger = (0, logger_1.createLogger)({ scope: 'CommentBlocklistService', time: app_environment_1.isDevEnv });
let CommentBlocklistService = class CommentBlocklistService {
    optionsService;
    constructor(optionsService) {
        this.optionsService = optionsService;
    }
    async validate(input) {
        const { blocklist } = await this.optionsService.ensureOptions();
        const { keywords, emails, ips } = blocklist;
        if (ips.includes(input.ip)) {
            throw new common_1.ForbiddenException(`Comment blocked by IP.`);
        }
        if (input.author_email && emails.includes(input.author_email)) {
            throw new common_1.ForbiddenException(`Comment blocked by Email.`);
        }
        const contentLower = input.content.toLowerCase();
        if (keywords.some((keyword) => contentLower.includes(keyword.toLowerCase()))) {
            throw new common_1.ForbiddenException('Comment blocked by Keywords.');
        }
    }
    async syncByStatus(inputList, status) {
        const ips = [...new Set(inputList.map((c) => c.ip).filter(Boolean))];
        const emails = [...new Set(inputList.map((c) => c.author_email).filter(Boolean))];
        if (!ips.length && !emails.length) {
            return;
        }
        const blocklistAction = status === comment_constant_1.CommentStatus.Spam
            ? this.optionsService.appendToBlocklist({ ips, emails })
            : this.optionsService.removeFromBlocklist({ ips, emails });
        try {
            await blocklistAction;
            logger.info('syncByStatus succeeded.', { ips, emails });
        }
        catch (error) {
            logger.warn('syncByStatus failed!', error);
        }
    }
};
exports.CommentBlocklistService = CommentBlocklistService;
exports.CommentBlocklistService = CommentBlocklistService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [options_service_1.OptionsService])
], CommentBlocklistService);
//# sourceMappingURL=comment.service.blocklist.js.map