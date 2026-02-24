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
exports.UserAuthStateService = exports.AuthIntent = void 0;
const crypto_1 = require("crypto");
const common_1 = require("@nestjs/common");
const cache_constant_1 = require("../../../constants/cache.constant");
const cache_service_1 = require("../../../core/cache/cache.service");
var AuthIntent;
(function (AuthIntent) {
    AuthIntent["Login"] = "login";
    AuthIntent["Link"] = "link";
})(AuthIntent || (exports.AuthIntent = AuthIntent = {}));
let UserAuthStateService = class UserAuthStateService {
    cacheService;
    constructor(cacheService) {
        this.cacheService = cacheService;
    }
    async generateCallbackState(payload) {
        const state = (0, crypto_1.randomUUID)();
        const stateKey = (0, cache_constant_1.getUserAuthStateCacheKey)(state);
        await this.cacheService.set(stateKey, payload, 5 * 60);
        return state;
    }
    async verifyCallbackState(state) {
        if (!state) {
            throw new common_1.BadRequestException('Missing required authorization state parameter.');
        }
        const stateKey = (0, cache_constant_1.getUserAuthStateCacheKey)(state);
        const statePayload = await this.cacheService.get(stateKey);
        if (!statePayload) {
            throw new common_1.BadRequestException('Invalid or expired authorization state. Please try logging in again.');
        }
        await this.cacheService.delete(stateKey);
        return statePayload;
    }
};
exports.UserAuthStateService = UserAuthStateService;
exports.UserAuthStateService = UserAuthStateService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cache_service_1.CacheService])
], UserAuthStateService);
//# sourceMappingURL=auth.service.state.js.map