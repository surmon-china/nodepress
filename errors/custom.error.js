"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
const common_1 = require("@nestjs/common");
const http_interface_1 = require("../interfaces/http.interface");
class CustomError extends common_1.HttpException {
    constructor(options, statusCode) {
        super(options, statusCode || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
exports.CustomError = CustomError;
//# sourceMappingURL=custom.error.js.map