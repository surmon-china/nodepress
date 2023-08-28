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
const common_1 = require("@nestjs/common");
const response_interface_1 = require("../interfaces/response.interface");
const value_constant_1 = require("../constants/value.constant");
const app_environment_1 = require("../app.environment");
let HttpExceptionFilter = class HttpExceptionFilter {
    catch(exception, host) {
        const request = host.switchToHttp().getRequest();
        const response = host.switchToHttp().getResponse();
        const exceptionStatus = exception.getStatus() || common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const errorResponse = exception.getResponse();
        const errorMessage = lodash_1.default.isString(errorResponse) ? errorResponse : errorResponse.message;
        const errorInfo = lodash_1.default.isString(errorResponse) ? null : errorResponse.error;
        const data = {
            status: response_interface_1.ResponseStatus.Error,
            message: errorMessage,
            error: (errorInfo === null || errorInfo === void 0 ? void 0 : errorInfo.message) || (lodash_1.default.isString(errorInfo) ? errorInfo : JSON.stringify(errorInfo)),
            debug: app_environment_1.isDevEnv ? (errorInfo === null || errorInfo === void 0 ? void 0 : errorInfo.stack) || exception.stack : value_constant_1.UNDEFINED
        };
        if (exceptionStatus === common_1.HttpStatus.NOT_FOUND) {
            data.error = data.error || `Not found`;
            data.message = data.message || `Invalid API: ${request.method} > ${request.url}`;
        }
        return response.status((errorInfo === null || errorInfo === void 0 ? void 0 : errorInfo.status) || exceptionStatus).jsonp(data);
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = __decorate([
    (0, common_1.Catch)()
], HttpExceptionFilter);
//# sourceMappingURL=error.filter.js.map