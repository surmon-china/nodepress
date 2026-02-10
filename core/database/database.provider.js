"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseProvider = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const event_emitter_1 = require("@nestjs/event-emitter");
const database_constant_1 = require("../../constants/database.constant");
const events_constant_1 = require("../../constants/events.constant");
const logger_1 = require("../../utils/logger");
const app_environment_1 = require("../../app.environment");
const APP_CONFIG = __importStar(require("../../app.config"));
const logger = (0, logger_1.createLogger)({ scope: 'MongoDB', time: app_environment_1.isDevEnv });
const DATABASE_RECONNECT_INTERVAL = 6000;
exports.databaseProvider = {
    inject: [event_emitter_1.EventEmitter2],
    provide: database_constant_1.DB_CONNECTION_TOKEN,
    useFactory: async (eventEmitter) => {
        let reconnectionTask = null;
        const connect = () => {
            return mongoose_1.default.connect(APP_CONFIG.MONGO_DB.uri, {
                serverSelectionTimeoutMS: 15 * 1000,
                connectTimeoutMS: 10 * 1000
            });
        };
        mongoose_1.default.set('strictQuery', false);
        mongoose_1.default.connection.on('connecting', () => {
            logger.log('connecting...');
        });
        mongoose_1.default.connection.on('open', () => {
            logger.success('connected. (opened)');
            if (reconnectionTask) {
                clearTimeout(reconnectionTask);
                reconnectionTask = null;
            }
        });
        mongoose_1.default.connection.on('disconnected', () => {
            logger.error(`disconnected! Attempting to reconnect after ${DATABASE_RECONNECT_INTERVAL / 1000}s`);
            eventEmitter.emit(events_constant_1.EventKeys.DatabaseError, 'MongoDB disconnected from server.');
            reconnectionTask = setTimeout(connect, DATABASE_RECONNECT_INTERVAL);
        });
        mongoose_1.default.connection.on('error', (error) => {
            logger.error('error!', error);
            eventEmitter.emit(events_constant_1.EventKeys.DatabaseError, error);
            if (mongoose_1.default.connection.readyState !== 0) {
                mongoose_1.default.disconnect();
            }
        });
        return await connect();
    }
};
//# sourceMappingURL=database.provider.js.map