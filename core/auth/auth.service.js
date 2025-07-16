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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const isEqual_1 = __importDefault(require("lodash/isEqual"));
const jwt_1 = require("@nestjs/jwt");
const common_1 = require("@nestjs/common");
const cache_constant_1 = require("../../constants/cache.constant");
const cache_service_1 = require("../cache/cache.service");
const app_config_1 = require("../../app.config");
let AuthService = class AuthService {
    jwtService;
    cacheService;
    constructor(jwtService, cacheService) {
        this.jwtService = jwtService;
        this.cacheService = cacheService;
    }
    async invalidateToken(token) {
        const payload = this.jwtService.decode(token);
        const now = Math.floor(Date.now() / 1000);
        if (!payload?.exp || payload.exp <= now) {
            return;
        }
        const ttl = payload.exp - now;
        const key = (0, cache_constant_1.getInvalidatedTokenCacheKey)(token);
        await this.cacheService.set(key, '1', ttl);
    }
    async isTokenInvalidated(token) {
        const key = (0, cache_constant_1.getInvalidatedTokenCacheKey)(token);
        return await this.cacheService.has(key);
    }
    signToken() {
        return this.jwtService.sign({ data: app_config_1.APP_BIZ.AUTH_JWT.data });
    }
    async verifyToken(token) {
        if (await this.isTokenInvalidated(token)) {
            return false;
        }
        try {
            const payload = this.jwtService.verify(token, { secret: app_config_1.APP_BIZ.AUTH_JWT.secret });
            return (0, isEqual_1.default)(payload.data, app_config_1.APP_BIZ.AUTH_JWT.data);
        }
        catch {
            return false;
        }
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