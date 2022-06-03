"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheLog = exports.redisLog = void 0;
const logger_1 = __importDefault(require("../../utils/logger"));
exports.redisLog = logger_1.default.scope('Redis');
exports.cacheLog = logger_1.default.scope('Cache');
//# sourceMappingURL=cache.logger.js.map