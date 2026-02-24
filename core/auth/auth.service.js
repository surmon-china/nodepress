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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const cache_service_1 = require("../cache/cache.service");
const cache_constant_1 = require("../../constants/cache.constant");
let AuthService = class AuthService {
    jwtService;
    cacheService;
    constructor(jwtService, cacheService) {
        this.jwtService = jwtService;
        this.cacheService = cacheService;
    }
    async isInvalidatedToken(token) {
        const key = (0, cache_constant_1.getInvalidatedTokenCacheKey)(token);
        return await this.cacheService.has(key);
    }
    decodeToken(token) {
        return this.jwtService.decode(token);
    }
    signToken(payload, options) {
        return this.jwtService.sign(payload, options);
    }
    async verifyToken(token, options) {
        if (await this.isInvalidatedToken(token)) {
            return null;
        }
        else {
            return await this.jwtService.verifyAsync(token, options);
        }
    }
    async invalidateToken(token) {
        const payload = this.jwtService.decode(token);
        if (!payload?.exp)
            return;
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp <= now)
            return;
        const ttl = payload.exp - now;
        const key = (0, cache_constant_1.getInvalidatedTokenCacheKey)(token);
        await this.cacheService.set(key, '1', ttl);
    }
    extractTokenFromAuthorization(authorization) {
        const [type, token] = authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        cache_service_1.CacheService])
], AuthService);
//# sourceMappingURL=auth.service.js.map