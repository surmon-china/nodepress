"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTestMode = exports.isProdMode = exports.isDevMode = exports.environment = void 0;
exports.environment = process.env.NODE_ENV;
exports.isDevMode = Object.is(exports.environment, 'development');
exports.isProdMode = Object.is(exports.environment, 'production');
exports.isTestMode = Object.is(exports.environment, 'test');
exports.default = {
    isDevMode: exports.isDevMode,
    isProdMode: exports.isProdMode,
    isTestMode: exports.isTestMode,
    environment: exports.environment,
};
//# sourceMappingURL=app.environment.js.map