"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transforms = void 0;
exports.createEnvGetter = createEnvGetter;
const logger_1 = __importDefault(require("./logger"));
const app_environment_1 = require("../app.environment");
exports.Transforms = {
    number: (v) => Number(v),
    json: (v) => JSON.parse(v)
};
function createEnvGetter(processEnv, prefix) {
    const getKey = (key) => (prefix ? `${prefix}_${key}` : key);
    function get(input) {
        if (typeof input === 'string') {
            return processEnv[getKey(input)];
        }
        const { key, required, message, transform, default: fallback, devFallback } = input;
        const fullKey = getKey(key);
        const raw = processEnv[fullKey];
        if (raw === undefined) {
            if (fallback !== undefined)
                return fallback;
            if (app_environment_1.isDevEnv && devFallback !== undefined) {
                if (required)
                    logger_1.default.warn(`"${fullKey}" is required in production. Currently using devFallback.`);
                return devFallback;
            }
            if (required) {
                logger_1.default.error(message ?? `Missing required environment variable: "${fullKey}"`);
            }
            return undefined;
        }
        return transform ? transform(raw) : raw;
    }
    return get;
}
//# sourceMappingURL=env.js.map