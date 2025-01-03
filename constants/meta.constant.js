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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GUEST_REQUEST_METADATA = exports.CACHE_TTL_METADATA = exports.CACHE_KEY_METADATA = exports.HTTP_RESPONSE_TRANSFORM_TO_PAGINATE = exports.HTTP_RESPONSE_TRANSFORM = exports.HTTP_SUCCESS_MESSAGE = exports.HTTP_SUCCESS_CODE = exports.HTTP_ERROR_MESSAGE = exports.HTTP_ERROR_CODE = void 0;
const constants = __importStar(require("@nestjs/common/constants"));
exports.HTTP_ERROR_CODE = '__appHttpErrorCode__';
exports.HTTP_ERROR_MESSAGE = '__appHttpErrorMessage__';
exports.HTTP_SUCCESS_CODE = constants.HTTP_CODE_METADATA;
exports.HTTP_SUCCESS_MESSAGE = '__appHttpSuccessMessage__';
exports.HTTP_RESPONSE_TRANSFORM = '__appHttpResponseTransform__';
exports.HTTP_RESPONSE_TRANSFORM_TO_PAGINATE = '__appHttpResponseTransformToPaginate__';
exports.CACHE_KEY_METADATA = '__appCacheKey__';
exports.CACHE_TTL_METADATA = '__appCacheTTL__';
exports.GUEST_REQUEST_METADATA = '__appGuestRequestOption__';
//# sourceMappingURL=meta.constant.js.map