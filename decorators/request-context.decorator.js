"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestContext = void 0;
const common_1 = require("@nestjs/common");
exports.RequestContext = (0, common_1.createParamDecorator)((_, context) => {
    const request = context.switchToHttp().getRequest();
    const ip = request.ip ?? request.ips?.[0];
    const visitor = {
        ip: ip?.replace('::ffff:', '').replace('::1', '') || null,
        agent: request.headers['user-agent'] || null,
        origin: request.headers.origin || null,
        referer: request.headers.referer || null
    };
    return {
        identity: request.identity,
        params: request.params,
        query: request.query,
        cookies: request.cookies,
        visitor,
        request
    };
});
//# sourceMappingURL=request-context.decorator.js.map