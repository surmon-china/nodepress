"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = void 0;
const lodash_1 = __importDefault(require("lodash"));
const app_environment_1 = require("../app.environment");
const http_interface_1 = require("../interfaces/http.interface");
const common_1 = require("@nestjs/common");
let HttpExceptionFilter = class HttpExceptionFilter {
    catch(exception, host) {
        const request = host.switchToHttp().getRequest();
        const response = host.switchToHttp().getResponse();
        const status = exception.getStatus() || common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const errorOption = exception.getResponse();
        const isString = (value) => lodash_1.default.isString(value);
        const errMessage = isString(errorOption) ? errorOption : errorOption.message;
        const errorInfo = isString(errorOption) ? null : errorOption.error;
        const parentErrorInfo = errorInfo ? String(errorInfo) : null;
        const isChildrenError = (errorInfo === null || errorInfo === void 0 ? void 0 : errorInfo.status) && (errorInfo === null || errorInfo === void 0 ? void 0 : errorInfo.message);
        const resultError = (isChildrenError && errorInfo.message) || parentErrorInfo;
        const resultStatus = isChildrenError ? errorInfo.status : status;
        const data = {
            status: http_interface_1.ResponseStatus.Error,
            message: errMessage,
            error: resultError,
            debug: app_environment_1.isDevMode ? exception.stack : null,
        };
        if (status === common_1.HttpStatus.NOT_FOUND) {
            data.error = `资源不存在`;
            data.message = `接口 ${request.method} -> ${request.url} 无效`;
        }
        return response.status(resultStatus).jsonp(data);
    }
};
HttpExceptionFilter = __decorate([
    (0, common_1.Catch)()
], HttpExceptionFilter);
exports.HttpExceptionFilter = HttpExceptionFilter;
//# sourceMappingURL=error.filter.js.map