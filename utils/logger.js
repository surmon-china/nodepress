"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogger = void 0;
const picocolors_1 = __importDefault(require("picocolors"));
const renderLogger = (options) => {
    return (...messages) => {
        const logs = [];
        logs.push(options.label);
        if (options.time) {
            const now = new Date();
            const formattedDate = now.toLocaleDateString();
            const formattedTime = now.toLocaleTimeString();
            const timestamp = `[${formattedDate} ${formattedTime}]`;
            logs.push(timestamp);
        }
        if (options.scope) {
            const scope = picocolors_1.default.green(picocolors_1.default.underline(picocolors_1.default.bold(options.scope)));
            logs.push(scope);
        }
        const msgs = messages.map((m) => (typeof m === 'string' ? options.formatter(m) : m));
        return options.consoler(...logs, ...msgs);
    };
};
const createLogger = (opts) => ({
    log: renderLogger(Object.assign({ label: '⚪', consoler: console.log, formatter: picocolors_1.default.cyanBright }, opts)),
    info: renderLogger(Object.assign({ label: '🔵', consoler: console.info, formatter: picocolors_1.default.greenBright }, opts)),
    warn: renderLogger(Object.assign({ label: '🟠', consoler: console.warn, formatter: picocolors_1.default.yellowBright }, opts)),
    error: renderLogger(Object.assign({ label: '🔴', consoler: console.error, formatter: picocolors_1.default.redBright }, opts)),
    debug: renderLogger(Object.assign({ label: '🟤', consoler: console.debug, formatter: picocolors_1.default.cyanBright }, opts)),
    success: renderLogger(Object.assign({ label: '🟢', consoler: console.log, formatter: picocolors_1.default.greenBright }, opts)),
    failure: renderLogger(Object.assign({ label: '🔴', consoler: console.warn, formatter: picocolors_1.default.redBright }, opts))
});
exports.createLogger = createLogger;
exports.default = (0, exports.createLogger)();
//# sourceMappingURL=logger.js.map