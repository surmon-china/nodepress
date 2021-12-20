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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OriginMiddleware = void 0;
const common_1 = require("@nestjs/common");
const http_interface_1 = require("../interfaces/http.interface");
const app_environment_1 = require("../app.environment");
const app_config_1 = require("../app.config");
const TEXT = __importStar(require("../constants/text.constant"));
let OriginMiddleware = class OriginMiddleware {
    use(request, response, next) {
        if (app_environment_1.isProdMode) {
            const { origin, referer } = request.headers;
            const checkHeader = (field) => !field || field.includes(app_config_1.CROSS_DOMAIN.allowedReferer);
            const isVerifiedOrigin = checkHeader(origin);
            const isVerifiedReferer = checkHeader(referer);
            if (!isVerifiedOrigin && !isVerifiedReferer) {
                return response.status(common_1.HttpStatus.UNAUTHORIZED).jsonp({
                    status: http_interface_1.ResponseStatus.Error,
                    message: TEXT.HTTP_ANONYMOUS_TEXT,
                    error: null,
                });
            }
        }
        return next();
    }
};
OriginMiddleware = __decorate([
    (0, common_1.Injectable)()
], OriginMiddleware);
exports.OriginMiddleware = OriginMiddleware;
//# sourceMappingURL=origin.middleware.js.map