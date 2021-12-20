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
const renderModule = (message) => {
    if (typeof message === 'string' && message.startsWith('[') && message.endsWith(']')) {
        return chalk_1.default.green.underline(message.substr(1, message.length - 2));
    }
    else {
        return message;
    }
};
const renderMessage = (color, messages) => {
    return messages.map((m) => (typeof m === 'string' ? color(m) : m));
};
const renderLog = (method, levelLabel, messageColor) => {
    return (message, ...args) => {
        return console[method](chalk_1.default.greenBright(`[NP]`), renderTime(), levelLabel, renderModule(message), ...renderMessage(messageColor, args));
    };
};
const createLogger = () => {
    return {
        debug: renderLog(LoggerLevel.Debug, chalk_1.default.cyan('[DEBUG]'), chalk_1.default.cyanBright),
        info: renderLog(LoggerLevel.Info, chalk_1.default.blue('[_INFO]'), chalk_1.default.greenBright),
        warn: renderLog(LoggerLevel.Warn, chalk_1.default.yellow('[_WARN]'), chalk_1.default.yellowBright),
        error: renderLog(LoggerLevel.Error, chalk_1.default.red('[ERROR]'), chalk_1.default.redBright),
    };
};
const logger = createLogger();
exports.default = logger;
//# sourceMappingURL=logger.js.map