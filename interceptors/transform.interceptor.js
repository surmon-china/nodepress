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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformInterceptor = exports.transformDataToPaginate = void 0;
const operators_1 = require("rxjs/operators");
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const http_interface_1 = require("../interfaces/http.interface");
const META = __importStar(require("../constants/meta.constant"));
const TEXT = __importStar(require("../constants/text.constant"));
function transformDataToPaginate(data, request) {
    return {
        data: data.documents,
        params: (request === null || request === void 0 ? void 0 : request.queryParams) || null,
        pagination: {
            total: data.total,
            current_page: data.page,
            per_page: data.perPage,
            total_page: data.totalPage,
        },
    };
}
exports.transformDataToPaginate = transformDataToPaginate;
let TransformInterceptor = class TransformInterceptor {
    constructor(reflector) {
        this.reflector = reflector;
    }
    intercept(context, next) {
        const call$ = next.handle();
        const target = context.getHandler();
        const request = context.switchToHttp().getRequest();
        const message = this.reflector.get(META.HTTP_SUCCESS_MESSAGE, target);
        const usePaginate = this.reflector.get(META.HTTP_RES_TRANSFORM_PAGINATE, target);
        return call$.pipe((0, operators_1.map)((data) => {
            return {
                result: usePaginate ? transformDataToPaginate(data, request) : data,
                status: http_interface_1.ResponseStatus.Success,
                message: message || TEXT.HTTP_DEFAULT_SUCCESS_TEXT,
            };
        }));
    }
};
TransformInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], TransformInterceptor);
exports.TransformInterceptor = TransformInterceptor;
//# sourceMappingURL=transform.interceptor.js.map