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
const database_constant_1 = require("../../constants/database.constant");
const helper_service_email_1 = require("../helper/helper.service.email");
const logger_1 = require("../../utils/logger");
const app_environment_1 = require("../../app.environment");
const APP_CONFIG = __importStar(require("../../app.config"));
const logger = (0, logger_1.createLogger)({ scope: 'MongoDB', time: app_environment_1.isDevEnv });
exports.databaseProvider = {
    inject: [helper_service_email_1.EmailService],
    provide: database_constant_1.DB_CONNECTION_TOKEN,
    useFactory: async (emailService) => {
        let reconnectionTask = null;
        const RECONNECT_INTERVAL = 6000;
        const sendAlarmMail = (error) => {
            emailService.sendMailAs(APP_CONFIG.APP_BIZ.NAME, {
                to: APP_CONFIG.APP_BIZ.ADMIN_EMAIL,
                subject: `MongoDB Error!`,
                text: error,
                html: `<pre><code>${error}</code></pre>`
            });
        };
        const connection = () => {
            return mongoose_1.default.connect(APP_CONFIG.MONGO_DB.uri, {});
        };
        mongoose_1.default.set('strictQuery', false);
        mongoose_1.default.connection.on('connecting', () => {
            logger.log('connecting...');
        });
        mongoose_1.default.connection.on('open', () => {
            logger.success('readied (open).');
            if (reconnectionTask) {
                clearTimeout(reconnectionTask);
                reconnectionTask = null;
            }
        });
        mongoose_1.default.connection.on('disconnected', () => {
            logger.error(`disconnected! retry after ${RECONNECT_INTERVAL / 1000}s`);
            reconnectionTask = setTimeout(connection, RECONNECT_INTERVAL);
        });
        mongoose_1.default.connection.on('error', (error) => {
            logger.error('error!', error);
            mongoose_1.default.disconnect();
            sendAlarmMail(String(error));
        });
        return await connection();
    }
};
//# sourceMappingURL=database.provider.js.map