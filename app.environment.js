"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTestEnv = exports.isProdEnv = exports.isDevEnv = exports.environment = void 0;
exports.environment = process.env.NODE_ENV;
exports.isDevEnv = Object.is(exports.environment, 'development');
exports.isProdEnv = Object.is(exports.environment, 'production');
exports.isTestEnv = Object.is(exports.environment, 'test');
exports.default = {
    isDevEnv: exports.isDevEnv,
    isProdEnv: exports.isProdEnv,
    isTestEnv: exports.isTestEnv,
    environment: exports.environment,
};
//# sourceMappingURL=app.environment.js.map