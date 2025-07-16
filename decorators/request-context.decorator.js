"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestContext = void 0;
const common_1 = require("@nestjs/common");
exports.RequestContext = (0, common_1.createParamDecorator)((_, context) => {
    const request = context.switchToHttp().getRequest();
    const ip = request.ip ?? request.ips?.[0];
    const visitor = {
        ip: ip?.replace('::ffff:', '').replace('::1', '') || null,
        ua: request.headers['user-agent'],
        origin: request.headers.origin,
        referer: request.headers.referer
    };
    return {
        token: request.locals.token,
        isAuthenticated: request.locals.isAuthenticated,
        isUnauthenticated: request.locals.isUnauthenticated,
        params: request.params,
        query: request.query,
        cookies: request.cookies,
        visitor,
        request
    };
});
//# sourceMappingURL=request-context.decorator.js.map