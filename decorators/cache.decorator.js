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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCacheTTL = exports.getCacheKey = void 0;
exports.Cache = Cache;
const isObject_1 = __importDefault(require("lodash/isObject"));
const common_1 = require("@nestjs/common");
const reflector_constant_1 = require("../constants/reflector.constant");
const value_constant_1 = require("../constants/value.constant");
const META = __importStar(require("../constants/meta.constant"));
function Cache(...args) {
    const option = args[0];
    const isOption = (value) => (0, isObject_1.default)(value);
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
const getCacheKey = (target) => {
    return reflector_constant_1.reflector.get(META.CACHE_KEY_METADATA, target);
};
exports.getCacheKey = getCacheKey;
const getCacheTTL = (target) => {
    return reflector_constant_1.reflector.get(META.CACHE_TTL_METADATA, target);
};
exports.getCacheTTL = getCacheTTL;
//# sourceMappingURL=cache.decorator.js.map