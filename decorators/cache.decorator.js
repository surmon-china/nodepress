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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHttpCacheTTL = exports.getHttpCacheKey = exports.HttpCache = void 0;
const lodash_1 = __importDefault(require("lodash"));
const common_1 = require("@nestjs/common");
const reflector_constant_1 = require("../constants/reflector.constant");
const META = __importStar(require("../constants/meta.constant"));
function HttpCache(...args) {
    const option = args[0];
    const isOption = (value) => lodash_1.default.isObject(value);
    const key = isOption(option) ? option.key : option;
    const ttl = isOption(option) ? option.ttl : args[1] || null;
    return (_, __, descriptor) => {
        if (key) {
            (0, common_1.SetMetadata)(META.HTTP_CACHE_KEY_METADATA, key)(descriptor.value);
        }
        if (ttl) {
            (0, common_1.SetMetadata)(META.HTTP_CACHE_TTL_METADATA, ttl)(descriptor.value);
        }
        return descriptor;
    };
}
exports.HttpCache = HttpCache;
const getHttpCacheKey = (target) => {
    return reflector_constant_1.reflector.get(META.HTTP_CACHE_KEY_METADATA, target);
};
exports.getHttpCacheKey = getHttpCacheKey;
const getHttpCacheTTL = (target) => {
    return reflector_constant_1.reflector.get(META.HTTP_CACHE_TTL_METADATA, target);
};
exports.getHttpCacheTTL = getHttpCacheTTL;
//# sourceMappingURL=cache.decorator.js.map