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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpProcessor = exports.paginate = exports.handle = exports.success = exports.error = void 0;
const lodash_1 = __importDefault(require("lodash"));
const common_1 = require("@nestjs/common");
const value_constant_1 = require("../constants/value.constant");
const META = __importStar(require("../constants/meta.constant"));
const TEXT = __importStar(require("../constants/text.constant"));
const buildHttpDecorator = (options) => {
    const { errMessage, successMessage, errCode, successCode, usePaginate } = options;
    return (_, __, descriptor) => {
        if (errCode) {
            (0, common_1.SetMetadata)(META.HTTP_ERROR_CODE, errCode)(descriptor.value);
        }
        if (successCode) {
            (0, common_1.SetMetadata)(META.HTTP_SUCCESS_CODE, successCode)(descriptor.value);
        }
        if (errMessage) {
            (0, common_1.SetMetadata)(META.HTTP_ERROR_MESSAGE, errMessage)(descriptor.value);
        }
        if (successMessage) {
            (0, common_1.SetMetadata)(META.HTTP_SUCCESS_MESSAGE, successMessage)(descriptor.value);
        }
        if (usePaginate) {
            (0, common_1.SetMetadata)(META.HTTP_RES_TRANSFORM_PAGINATE, true)(descriptor.value);
        }
        return descriptor;
    };
};
const error = (message, statusCode) => {
    return buildHttpDecorator({ errMessage: message, errCode: statusCode });
};
exports.error = error;
const success = (message, statusCode) => {
    return buildHttpDecorator({
        successMessage: message,
        successCode: statusCode,
    });
};
exports.success = success;
function handle(...args) {
    const option = args[0];
    const isOption = (value) => lodash_1.default.isObject(value);
    const message = isOption(option) ? option.message : option;
    const errMessage = message + TEXT.HTTP_ERROR_SUFFIX;
    const successMessage = message + TEXT.HTTP_SUCCESS_SUFFIX;
    const errCode = isOption(option) ? option.error : value_constant_1.UNDEFINED;
    const successCode = isOption(option) ? option.success : value_constant_1.UNDEFINED;
    const usePaginate = isOption(option) ? option.usePaginate : false;
    return buildHttpDecorator({
        errCode,
        successCode,
        errMessage,
        successMessage,
        usePaginate,
    });
}
exports.handle = handle;
const paginate = () => {
    return buildHttpDecorator({ usePaginate: true });
};
exports.paginate = paginate;
exports.HttpProcessor = { error: exports.error, success: exports.success, handle, paginate: exports.paginate };
//# sourceMappingURL=http.decorator.js.map