"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CookieToken = exports.decodeToken = exports.encodeToken = exports.TOKEN_COOKIE_KEY = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const common_1 = require("@nestjs/common");
const app_config_1 = require("../../app.config");
exports.TOKEN_COOKIE_KEY = '_disqus';
const encodeToken = (token) => {
    return jsonwebtoken_1.default.sign(token, app_config_1.DISQUS.adminAccessToken, {
        expiresIn: token.expires_in,
    });
};
exports.encodeToken = encodeToken;
const decodeToken = (token) => {
    try {
        const result = jsonwebtoken_1.default.verify(token, app_config_1.DISQUS.adminAccessToken);
        return result || null;
    }
    catch (error) {
        return null;
    }
};
exports.decodeToken = decodeToken;
exports.CookieToken = (0, common_1.createParamDecorator)((key = exports.TOKEN_COOKIE_KEY, context) => {
    const request = context.switchToHttp().getRequest();
    const cookies = request.cookies;
    const token = cookies[key];
    return token ? (0, exports.decodeToken)(token) : null;
});
//# sourceMappingURL=disqus.token.js.map