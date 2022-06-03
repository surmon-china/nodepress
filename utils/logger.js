"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
var LoggerLevel;
(function (LoggerLevel) {
    LoggerLevel["Debug"] = "debug";
    LoggerLevel["Info"] = "info";
    LoggerLevel["Warn"] = "warn";
    LoggerLevel["Error"] = "error";
})(LoggerLevel || (LoggerLevel = {}));
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
const renderLog = (method, level, color, scope) => {
    return (...messages) => {
        const logs = [];
        logs.push(chalk_1.default.greenBright(`[NP]`));
        logs.push(renderTime());
        logs.push(level);
        if (scope) {
            logs.push(renderScope(scope));
        }
        return console[method](...logs, ...renderMessage(color, messages));
    };
};
const createLogger = (scope) => ({
    debug: renderLog(LoggerLevel.Debug, chalk_1.default.cyan('[DEBUG]'), chalk_1.default.cyanBright, scope),
    info: renderLog(LoggerLevel.Info, chalk_1.default.blue('[_INFO]'), chalk_1.default.greenBright, scope),
    warn: renderLog(LoggerLevel.Warn, chalk_1.default.yellow('[_WARN]'), chalk_1.default.yellowBright, scope),
    error: renderLog(LoggerLevel.Error, chalk_1.default.red('[ERROR]'), chalk_1.default.redBright, scope),
});
exports.default = Object.assign(Object.assign({}, createLogger()), { scope: createLogger });
//# sourceMappingURL=logger.js.map