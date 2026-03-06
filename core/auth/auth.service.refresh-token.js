"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRefreshTokenService = void 0;
const crypto = __importStar(require("crypto"));
const common_1 = require("@nestjs/common");
const cache_service_1 = require("../cache/cache.service");
const cache_constant_1 = require("../../constants/cache.constant");
let AuthRefreshTokenService = class AuthRefreshTokenService {
    cacheService;
    constructor(cacheService) {
        this.cacheService = cacheService;
    }
    generateToken() {
        return crypto.randomBytes(32).toString('hex');
    }
    async storeToken(token, payload, expiresIn) {
        const key = (0, cache_constant_1.getRefreshTokenCacheKey)(token);
        await this.cacheService.set(key, payload, expiresIn);
    }
    async revokeToken(token) {
        const key = (0, cache_constant_1.getRefreshTokenCacheKey)(token);
        await this.cacheService.delete(key);
    }
    async getPayload(token) {
        const key = (0, cache_constant_1.getRefreshTokenCacheKey)(token);
        const payload = await this.cacheService.get(key);
        return payload ?? null;
    }
};
exports.AuthRefreshTokenService = AuthRefreshTokenService;
exports.AuthRefreshTokenService = AuthRefreshTokenService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cache_service_1.CacheService])
], AuthRefreshTokenService);
//# sourceMappingURL=auth.service.refresh-token.js.map