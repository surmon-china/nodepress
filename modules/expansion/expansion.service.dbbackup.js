"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBBackupService = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const shelljs_1 = __importDefault(require("shelljs"));
const moment_1 = __importDefault(require("moment"));
const node_schedule_1 = __importDefault(require("node-schedule"));
const common_1 = require("@nestjs/common");
const helper_service_cs_1 = require("../../processors/helper/helper.service.cs");
const logger_1 = __importDefault(require("../../utils/logger"));
const APP_CONFIG = __importStar(require("../../app.config"));
const UP_FAILED_TIMEOUT = 1000 * 60 * 5;
const UPLOAD_INTERVAL = '0 0 3 * * *';
const BACKUP_FILE_NAME = 'nodepress.tar.gz';
const BACKUP_DIR_PATH = path_1.default.join(APP_CONFIG.APP.ROOT_PATH, 'dbbackup');
const BACKUP_DATA_PATH = path_1.default.join(BACKUP_DIR_PATH, BACKUP_FILE_NAME);
const SHELL_DIR_PATH = path_1.default.join(APP_CONFIG.APP.ROOT_PATH, 'scripts');
const BACKUP_SHELL_PATH = path_1.default.normalize(path_1.default.join(SHELL_DIR_PATH, 'dbbackup.sh'));
let DBBackupService = class DBBackupService {
    constructor(cloudStorageService) {
        this.cloudStorageService = cloudStorageService;
        logger_1.default.info('[expansion]', 'DB Backup 开始执行定时数据备份任务！');
        node_schedule_1.default.scheduleJob(UPLOAD_INTERVAL, () => {
            this.backup().catch(() => {
                setTimeout(this.backup, UP_FAILED_TIMEOUT);
            });
        });
    }
    backup() {
        return new Promise((resolve, reject) => {
            if (!fs_1.default.existsSync(BACKUP_SHELL_PATH)) {
                return reject('DB Backup shell 脚本不存在');
            }
            shelljs_1.default.exec(`sh ${BACKUP_SHELL_PATH}`, (code, out) => {
                const fileDate = (0, moment_1.default)(new Date()).format('YYYY-MM-DD-HH:mm');
                const fileName = `nodepress-db-backup-${fileDate}.tar.gz`;
                logger_1.default.info('[expansion]', 'DB Backup shell 执行完成！', code, out);
                logger_1.default.info('[expansion]', 'DB Backup 上传文件: ' + fileName);
                logger_1.default.info('[expansion]', 'DB Backup 文件源位置: ' + BACKUP_DATA_PATH);
                this.cloudStorageService
                    .uploadFile(fileName, BACKUP_DATA_PATH, APP_CONFIG.DB_BACKUP.region, APP_CONFIG.DB_BACKUP.bucket)
                    .then((result) => {
                    logger_1.default.info('[expansion]', 'DB Backup succeed!', {
                        name: result.name,
                        url: result.url,
                    });
                    return resolve();
                })
                    .catch((error) => {
                    logger_1.default.warn('[expansion]', 'DB Backup failed!', error);
                    reject(JSON.stringify(error.message));
                });
            });
        });
    }
};
DBBackupService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [helper_service_cs_1.CloudStorageService])
], DBBackupService);
exports.DBBackupService = DBBackupService;
//# sourceMappingURL=expansion.service.dbbackup.js.map