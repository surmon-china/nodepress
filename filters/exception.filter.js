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
const isString_1 = __importDefault(require("lodash/isString"));
const common_1 = require("@nestjs/common");
const response_interface_1 = require("../interfaces/response.interface");
let HttpExceptionFilter = class HttpExceptionFilter {
    catch(exception, host) {
        const context = host.switchToHttp();
        const response = context.getResponse();
        const timestamp = new Date().toISOString();
        if (exception instanceof common_1.HttpException) {
            const errorInfo = exception.getResponse();
            response.code(exception.getStatus()).send({
                status: response_interface_1.ResponseStatus.Error,
                message: (0, isString_1.default)(errorInfo) ? errorInfo : errorInfo.message,
                error: (0, isString_1.default)(errorInfo) ? null : errorInfo.error,
                timestamp
            });
        }
        else {
            response.code(common_1.HttpStatus.INTERNAL_SERVER_ERROR).send({
                status: response_interface_1.ResponseStatus.Error,
                message: exception instanceof Error ? exception.message : String(exception),
                error: 'Internal Server Error',
                timestamp
            });
        }
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = __decorate([
    (0, common_1.Catch)()
], HttpExceptionFilter);
//# sourceMappingURL=exception.filter.js.map