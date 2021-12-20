"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTP_CACHE_TTL_METADATA = exports.HTTP_CACHE_KEY_METADATA = exports.HTTP_RES_TRANSFORM_PAGINATE = exports.HTTP_SUCCESS_MESSAGE = exports.HTTP_ERROR_MESSAGE = exports.HTTP_MESSAGE = exports.HTTP_SUCCESS_CODE = exports.HTTP_ERROR_CODE = void 0;
const constants = __importStar(require("@nestjs/common/constants"));
const cache_constants_1 = require("@nestjs/common/cache/cache.constants");
exports.HTTP_ERROR_CODE = '__customHttpErrorCode__';
exports.HTTP_SUCCESS_CODE = constants.HTTP_CODE_METADATA;
exports.HTTP_MESSAGE = '__customHttpMessage__';
exports.HTTP_ERROR_MESSAGE = '__customHttpErrorMessage__';
exports.HTTP_SUCCESS_MESSAGE = '__customHttpSuccessMessage__';
exports.HTTP_RES_TRANSFORM_PAGINATE = '__customHttpResTransformPagenate__';
exports.HTTP_CACHE_KEY_METADATA = cache_constants_1.CACHE_KEY_METADATA;
exports.HTTP_CACHE_TTL_METADATA = '__customHttpCacheTTL__';
//# sourceMappingURL=meta.constant.js.map