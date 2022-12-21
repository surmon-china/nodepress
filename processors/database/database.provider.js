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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseProvider = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const helper_service_email_1 = require("../helper/helper.service.email");
const system_constant_1 = require("../../constants/system.constant");
const APP_CONFIG = __importStar(require("../../app.config"));
const logger_1 = __importDefault(require("../../utils/logger"));
const log = logger_1.default.scope('MongoDB');
exports.databaseProvider = {
    inject: [helper_service_email_1.EmailService],
    provide: system_constant_1.DB_CONNECTION_TOKEN,
    useFactory: async (emailService) => {
        let reconnectionTask = null;
        const RECONNECT_INTERVAL = 6000;
        const sendAlarmMail = (error) => {
            emailService.sendMailAs(APP_CONFIG.APP.NAME, {
                to: APP_CONFIG.APP.ADMIN_EMAIL,
                subject: `MongoDB Error!`,
                text: error,
                html: `<pre><code>${error}</code></pre>`,
            });
        };
        const connection = () => {
            return mongoose_1.default.connect(APP_CONFIG.MONGO_DB.uri, {});
        };
        mongoose_1.default.set('strictQuery', false);
        mongoose_1.default.connection.on('connecting', () => {
            log.info('connecting...');
        });
        mongoose_1.default.connection.on('open', () => {
            log.info('readied (open).');
            if (reconnectionTask) {
                clearTimeout(reconnectionTask);
                reconnectionTask = null;
            }
        });
        mongoose_1.default.connection.on('disconnected', () => {
            log.error(`disconnected! retry when after ${RECONNECT_INTERVAL / 1000}s`);
            reconnectionTask = setTimeout(connection, RECONNECT_INTERVAL);
        });
        mongoose_1.default.connection.on('error', (error) => {
            log.error('error!', error);
            mongoose_1.default.disconnect();
            sendAlarmMail(String(error));
        });
        return await connection();
    },
};
//# sourceMappingURL=database.provider.js.map