"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSuccessResponseOptions = void 0;
exports.SuccessResponse = SuccessResponse;
const common_1 = require("@nestjs/common");
const reflector_constant_1 = require("../constants/reflector.constant");
const METADATA_HTTP_SUCCESS_CODE = 'app:http:status_code';
const METADATA_HTTP_SUCCESS_MESSAGE = 'app:http:success_message';
const METADATA_HTTP_RESPONSE_TRANSFORM = 'app:http:response_transform';
const METADATA_HTTP_RESPONSE_PAGINATE = 'app:http:response_paginate';
const getSuccessResponseOptions = (target) => ({
    message: reflector_constant_1.reflector.get(METADATA_HTTP_SUCCESS_MESSAGE, target),
    status: reflector_constant_1.reflector.get(METADATA_HTTP_SUCCESS_CODE, target),
    useTransform: reflector_constant_1.reflector.get(METADATA_HTTP_RESPONSE_TRANSFORM, target),
    usePaginate: reflector_constant_1.reflector.get(METADATA_HTTP_RESPONSE_PAGINATE, target)
});
exports.getSuccessResponseOptions = getSuccessResponseOptions;
function SuccessResponse(input) {
    const options = typeof input === 'string' ? { message: input } : input;
    return (_, __, descriptor) => {
        (0, common_1.SetMetadata)(METADATA_HTTP_RESPONSE_TRANSFORM, true)(descriptor.value);
        if (options.status) {
            (0, common_1.SetMetadata)(METADATA_HTTP_SUCCESS_CODE, options.status)(descriptor.value);
        }
        if (options.message) {
            (0, common_1.SetMetadata)(METADATA_HTTP_SUCCESS_MESSAGE, options.message)(descriptor.value);
        }
        if (options.usePaginate) {
            (0, common_1.SetMetadata)(METADATA_HTTP_RESPONSE_PAGINATE, true)(descriptor.value);
        }
        return descriptor;
    };
}
//# sourceMappingURL=success-response.decorator.js.map