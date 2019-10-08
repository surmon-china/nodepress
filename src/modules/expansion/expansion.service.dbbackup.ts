/**
 * Expansion DB backup service.
 * @file 数据库备份服务
 * @module module/expansion/dbbackup.service
 * @author Surmon <https://github.com/surmon-china>
 */

import * as fs from 'fs';
import * as path from 'path';
import * as qiniu from 'qiniu';
import * as shell from 'shelljs';
import * as moment from 'moment';
import * as schedule from 'node-schedule';
import * as APP_CONFIG from '@app/app.config';
import { Injectable } from '@nestjs/common';

// Configs
const UPFAILE_TIMEOUT = 1000 * 60 * 5;
const UPLOAD_INTERVAL = '0 0 3 * * *';

const BACKUP_FILE_EXT = '.tar.gz';
const BACK_UP_SHELL_PATH = path.normalize(APP_CONFIG.DB_BACKUP.backupShellPath);
const BACK_UP_DATA_PATH = path.resolve(APP_CONFIG.DB_BACKUP.backupFilePath, `nodepress${BACKUP_FILE_EXT}`);

// Qiniu sdk
const mac = new qiniu.auth.digest.Mac(
  APP_CONFIG.DB_BACKUP.accessKey,
  APP_CONFIG.DB_BACKUP.secretKey,
);

const putPolicy = new qiniu.rs.PutPolicy({
  scope: APP_CONFIG.DB_BACKUP.bucket,
});

const qiniuConfig = new qiniu.conf.Config({
  zone: qiniu.zone.Zone_z0,
  useHttpsDomain: false,
  useCdnDomain: false,
});

const formUploader = new qiniu.form_up.FormUploader(qiniuConfig);
const putExtra = new qiniu.form_up.PutExtra();

@Injectable()
export class DBBackupcService {

  constructor() {
    console.log('DB Backup 开始执行定时数据备份任务！');
    schedule.scheduleJob(UPLOAD_INTERVAL, () => {
      this.backup().catch(() => {
        setTimeout(this.backup, UPFAILE_TIMEOUT);
      });
    });
  }

  // 打包备份并上传
  public backup(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(BACK_UP_SHELL_PATH)) {
        return reject('DB Backup shell 脚本不存在');
      }

      shell.exec(`sh ${BACK_UP_SHELL_PATH}`, (code, stdout, stderr) => {

        const fileDate = moment(new Date()).format('YYYY-MM-DD-HH:mm');
        const fileName = `nodepress-db-backup-${fileDate}${BACKUP_FILE_EXT}`;
        console.info('DB Backup shell 执行完成！', code);
        console.info('DB Backup 上传文件: ' + fileName);
        console.info('DB Backup 文件源位置: ' + BACK_UP_DATA_PATH);

        // get token
        const uptoken = putPolicy.uploadToken(mac);

        // upload file
        formUploader.putFile(uptoken, fileName, BACK_UP_DATA_PATH, putExtra, (respErr, respBody, respInfo) => {
          if (respErr) {
            console.warn('DB Backup 备份数据上传失败!', respErr);
            return reject(String(respErr));
          }

          if (respInfo.statusCode === 200) {
            console.info('DB Backup 备份数据上传成功!', respBody.key);
            return resolve();
          }

          console.warn('DB Backup 备份数据上传状态响应异常!', respInfo.statusCode, respBody);
          reject(JSON.stringify(respBody));
        });
      });
    });
  }
}
