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
exports.Responser = exports.paginate = exports.success = exports.error = exports.getResponserOptions = void 0;
exports.handle = handle;
const isObject_1 = __importDefault(require("lodash/isObject"));
const common_1 = require("@nestjs/common");
const value_constant_1 = require("../constants/value.constant");
const reflector_constant_1 = require("../constants/reflector.constant");
const META = __importStar(require("../constants/meta.constant"));
const TEXT = __importStar(require("../constants/text.constant"));
const getResponserOptions = (target) => {
    return {
        errorCode: reflector_constant_1.reflector.get(META.HTTP_ERROR_CODE, target),
        successCode: reflector_constant_1.reflector.get(META.HTTP_SUCCESS_CODE, target),
        errorMessage: reflector_constant_1.reflector.get(META.HTTP_ERROR_MESSAGE, target),
        successMessage: reflector_constant_1.reflector.get(META.HTTP_SUCCESS_MESSAGE, target),
        transform: reflector_constant_1.reflector.get(META.HTTP_RESPONSE_TRANSFORM, target),
        paginate: reflector_constant_1.reflector.get(META.HTTP_RESPONSE_TRANSFORM_TO_PAGINATE, target)
    };
};
exports.getResponserOptions = getResponserOptions;
const createDecorator = (options) => {
    const { errorMessage, successMessage, errorCode, successCode, usePaginate } = options;
    return (_, __, descriptor) => {
        (0, common_1.SetMetadata)(META.HTTP_RESPONSE_TRANSFORM, true)(descriptor.value);
        if (errorCode) {
            (0, common_1.SetMetadata)(META.HTTP_ERROR_CODE, errorCode)(descriptor.value);
        }
        if (successCode) {
            (0, common_1.SetMetadata)(META.HTTP_SUCCESS_CODE, successCode)(descriptor.value);
        }
        if (errorMessage) {
            (0, common_1.SetMetadata)(META.HTTP_ERROR_MESSAGE, errorMessage)(descriptor.value);
        }
        if (successMessage) {
            (0, common_1.SetMetadata)(META.HTTP_SUCCESS_MESSAGE, successMessage)(descriptor.value);
        }
        if (usePaginate) {
            (0, common_1.SetMetadata)(META.HTTP_RESPONSE_TRANSFORM_TO_PAGINATE, true)(descriptor.value);
        }
        return descriptor;
    };
};
const error = (message, statusCode) => {
    return createDecorator({ errorMessage: message, errorCode: statusCode });
};
exports.error = error;
const success = (message, statusCode) => {
    return createDecorator({
        successMessage: message,
        successCode: statusCode
    });
};
exports.success = success;
function handle(...args) {
    const option = args[0];
    const isOption = (value) => (0, isObject_1.default)(value);
    const message = isOption(option) ? option.message : option;
    const errorMessage = message + TEXT.HTTP_ERROR_SUFFIX;
    const successMessage = message + TEXT.HTTP_SUCCESS_SUFFIX;
    const errorCode = isOption(option) ? option.error : value_constant_1.UNDEFINED;
    const successCode = isOption(option) ? option.success : value_constant_1.UNDEFINED;
    const usePaginate = isOption(option) ? option.usePaginate : false;
    return createDecorator({
        errorCode,
        successCode,
        errorMessage,
        successMessage,
        usePaginate
    });
}
const paginate = () => {
    return createDecorator({ usePaginate: true });
};
exports.paginate = paginate;
exports.Responser = { error: exports.error, success: exports.success, handle, paginate: exports.paginate };
//# sourceMappingURL=responser.decorator.js.map