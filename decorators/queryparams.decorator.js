"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryParams = void 0;
const common_1 = require("@nestjs/common");
exports.QueryParams = (0, common_1.createParamDecorator)((field, context) => {
    const request = context.switchToHttp().getRequest();
    const isAuthenticated = request.isAuthenticated();
    const isUnauthenticated = request.isUnauthenticated();
    const ip = request.headers['x-forwarded-for'] ||
        request.headers['x-real-ip'] ||
        request.socket.remoteAddress ||
        request.ip ||
        request.ips[0];
    const visitor = {
        ip: ip.replace('::ffff:', '').replace('::1', ''),
        ua: request.headers['user-agent'],
        origin: request.headers.origin,
        referer: request.headers.referer,
    };
    const result = {
        isAuthenticated,
        isUnauthenticated,
        params: request.params,
        query: request.query,
        cookies: request.cookies,
        visitor,
        request,
    };
    return field ? result[field] : result;
});
//# sourceMappingURL=queryparams.decorator.js.map