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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformInterceptor = void 0;
const operators_1 = require("rxjs/operators");
const common_1 = require("@nestjs/common");
const response_interface_1 = require("../interfaces/response.interface");
const responser_decorator_1 = require("../decorators/responser.decorator");
const TEXT = __importStar(require("../constants/text.constant"));
let TransformInterceptor = class TransformInterceptor {
    intercept(context, next) {
        const call$ = next.handle();
        const target = context.getHandler();
        const { successMessage, transform, paginate } = (0, responser_decorator_1.getResponserOptions)(target);
        if (!transform) {
            return call$;
        }
        const request = context.switchToHttp().getRequest();
        return call$.pipe((0, operators_1.map)((data) => {
            return {
                status: response_interface_1.ResponseStatus.Success,
                message: successMessage || TEXT.HTTP_DEFAULT_SUCCESS_TEXT,
                params: {
                    isAuthenticated: request.isAuthenticated(),
                    isUnauthenticated: request.isUnauthenticated(),
                    url: request.url,
                    method: request.method,
                    routes: request.params,
                    payload: request.$validatedPayload || {},
                },
                result: paginate
                    ? {
                        data: data.documents,
                        pagination: {
                            total: data.total,
                            current_page: data.page,
                            per_page: data.perPage,
                            total_page: data.totalPage,
                        },
                    }
                    : data,
            };
        }));
    }
};
TransformInterceptor = __decorate([
    (0, common_1.Injectable)()
], TransformInterceptor);
exports.TransformInterceptor = TransformInterceptor;
//# sourceMappingURL=transform.interceptor.js.map