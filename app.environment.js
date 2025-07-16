"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isProdEnv = exports.isDevEnv = exports.environment = void 0;
exports.environment = process.env.NODE_ENV;
exports.isDevEnv = exports.environment === 'development';
exports.isProdEnv = exports.environment === 'production';
exports.default = {
    isDevEnv: exports.isDevEnv,
    isProdEnv: exports.isProdEnv,
    environment: exports.environment
};
//# sourceMappingURL=app.environment.js.map