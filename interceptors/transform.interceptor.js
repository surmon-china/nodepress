"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformInterceptor = void 0;
const operators_1 = require("rxjs/operators");
const common_1 = require("@nestjs/common");
const response_interface_1 = require("../interfaces/response.interface");
const success_response_decorator_1 = require("../decorators/success-response.decorator");
let TransformInterceptor = class TransformInterceptor {
    intercept(context, next) {
        const reponseOptions = (0, success_response_decorator_1.getSuccessResponseOptions)(context.getHandler());
        if (!reponseOptions.useTransform) {
            return next.handle();
        }
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        return next.handle().pipe((0, operators_1.map)((data) => {
            if (reponseOptions.status) {
                response.status(reponseOptions.status);
            }
            return {
                status: response_interface_1.ResponseStatus.Success,
                message: reponseOptions.message ?? 'Success',
                context: {
                    url: request.url,
                    method: request.method,
                    route_params: request.params ?? {},
                    query_params: request.validatedQueryParams ?? {},
                    identity: {
                        role: request.identity.role,
                        is_guest: request.identity.isGuest,
                        is_admin: request.identity.isAdmin,
                        is_user: request.identity.isUser,
                        uid: request.identity.payload?.uid ?? null
                    }
                },
                result: !reponseOptions.usePaginate
                    ? data
                    : {
                        data: data.documents,
                        pagination: {
                            total: data.total,
                            current_page: data.page,
                            per_page: data.perPage,
                            total_page: data.totalPage
                        }
                    }
            };
        }));
    }
};
exports.TransformInterceptor = TransformInterceptor;
exports.TransformInterceptor = TransformInterceptor = __decorate([
    (0, common_1.Injectable)()
], TransformInterceptor);
//# sourceMappingURL=transform.interceptor.js.map