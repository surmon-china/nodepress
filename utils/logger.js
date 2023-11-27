"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogger = void 0;
const chalk_1 = __importDefault(require("chalk"));
const renderTime = () => {
    const now = new Date();
    return `[${now.toLocaleDateString()} ${now.toLocaleTimeString()}]`;
};
const renderScope = (scope) => {
    return chalk_1.default.green.underline(scope);
};
const renderMessage = (color, messages) => {
    return messages.map((m) => (typeof m === 'string' ? color(m) : m));
};
const renderLogger = (options) => {
    return (...messages) => {
        const logs = [];
        logs.push(options.label);
        if (options.time) {
            logs.push(renderTime());
        }
        if (options.scope) {
            logs.push(renderScope(options.scope));
        }
        return options.consoler(...logs, ...renderMessage(options.color, messages));
    };
};
const createLogger = (opts) => ({
    log: renderLogger(Object.assign({ label: '⚪', consoler: console.log, color: chalk_1.default.cyanBright }, opts)),
    info: renderLogger(Object.assign({ label: '🔵', consoler: console.info, color: chalk_1.default.greenBright }, opts)),
    warn: renderLogger(Object.assign({ label: '🟠', consoler: console.warn, color: chalk_1.default.yellowBright }, opts)),
    error: renderLogger(Object.assign({ label: '🔴', consoler: console.error, color: chalk_1.default.redBright }, opts)),
    debug: renderLogger(Object.assign({ label: '🟤', consoler: console.debug, color: chalk_1.default.cyanBright }, opts)),
    success: renderLogger(Object.assign({ label: '🟢', consoler: console.log, color: chalk_1.default.greenBright }, opts)),
    failure: renderLogger(Object.assign({ label: '🔴', consoler: console.warn, color: chalk_1.default.redBright }, opts))
});
exports.createLogger = createLogger;
exports.default = (0, exports.createLogger)();
//# sourceMappingURL=logger.js.map