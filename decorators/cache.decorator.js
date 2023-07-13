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
exports.getCacheTTL = exports.getCacheKey = exports.Cache = void 0;
const lodash_1 = __importDefault(require("lodash"));
const common_1 = require("@nestjs/common");
const reflector_constant_1 = require("../constants/reflector.constant");
const value_constant_1 = require("../constants/value.constant");
const META = __importStar(require("../constants/meta.constant"));
function Cache(...args) {
    const option = args[0];
    const isOption = (value) => lodash_1.default.isObject(value);
    const key = isOption(option) ? option.key : option;
    const ttl = isOption(option) ? option.ttl : args[1] || value_constant_1.NULL;
    return (_, __, descriptor) => {
        if (key) {
            (0, common_1.SetMetadata)(META.CACHE_KEY_METADATA, key)(descriptor.value);
        }
        if (ttl) {
            (0, common_1.SetMetadata)(META.CACHE_TTL_METADATA, ttl)(descriptor.value);
        }
        return descriptor;
    };
}
exports.Cache = Cache;
const getCacheKey = (target) => {
    return reflector_constant_1.reflector.get(META.CACHE_KEY_METADATA, target);
};
exports.getCacheKey = getCacheKey;
const getCacheTTL = (target) => {
    return reflector_constant_1.reflector.get(META.CACHE_TTL_METADATA, target);
};
exports.getCacheTTL = getCacheTTL;
//# sourceMappingURL=cache.decorator.js.map