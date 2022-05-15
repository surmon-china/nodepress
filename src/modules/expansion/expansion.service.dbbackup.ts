/**
 * @file Expansion DB backup service
 * @module module/expansion/dbbackup.service
 * @author Surmon <https://github.com/surmon-china>
 */

import fs from 'fs'
import path from 'path'
import shell from 'shelljs'
import moment from 'moment'
import schedule from 'node-schedule'
import { Injectable } from '@nestjs/common'
import { EmailService } from '@app/processors/helper/helper.service.email'
import { AWSService } from '@app/processors/helper/helper.service.aws'
import { APP, MONGO_DB, DB_BACKUP } from '@app/app.config'
import logger from '@app/utils/logger'

const UP_FAILED_TIMEOUT = 1000 * 60 * 5
const UPLOAD_INTERVAL = '0 0 3 * * *'
const BACKUP_FILE_NAME = 'nodepress.zip'
const BACKUP_DIR_PATH = path.join(APP.ROOT_PATH, 'dbbackup')

@Injectable()
export class DBBackupService {
  constructor(private readonly emailService: EmailService, private readonly awsService: AWSService) {
    logger.info('[expansion]', 'DB Backup 开始执行定时数据备份任务！')
    schedule.scheduleJob(UPLOAD_INTERVAL, () => {
      this.backup().catch(() => {
        setTimeout(this.backup, UP_FAILED_TIMEOUT)
      })
    })
  }

  public async backup() {
    try {
      const result = await this.doBackup()
      this.mailToAdmin('Database backup succeed', JSON.stringify(result, null, 2))
      return result
    } catch (error) {
      this.mailToAdmin('Database backup failed!', String(error))
      throw error
    }
  }

  private mailToAdmin(subject: string, detail: string) {
    const content = `${subject}, detail: ${detail}`
    this.emailService.sendMailAs(APP.NAME, {
      to: APP.ADMIN_EMAIL,
      subject,
      text: content,
      html: content,
    })
  }

  private doBackup() {
    return new Promise<{ url: string; key: string }>((resolve, reject) => {
      if (!shell.which('mongodump')) {
        return reject('DB Backup script requires [mongodump]')
      }

      shell.cd(BACKUP_DIR_PATH)
      shell.rm('-rf', `./backup.prev`)
      shell.mv('./backup', './backup.prev')
      shell.mkdir('backup')

      shell.exec(`mongodump --uri="${MONGO_DB.uri}" --out="backup"`, (code, out) => {
        logger.info('[expansion]', 'DB Backup mongodump 执行完成！', code, out)
        if (code !== 0) {
          logger.warn('[expansion]', 'DB Backup mongodump failed!', out)
          return reject(out)
        }

        if (!shell.which('zip')) {
          return reject('DB Backup script requires [zip]')
        }

        // tar -czf - backup | openssl des3 -salt -k <password> -out target.tar.gz
        // shell.exec(`tar -czf ${BACKUP_FILE_NAME} ./backup`)
        shell.exec(`zip -r -P ${DB_BACKUP.password} ${BACKUP_FILE_NAME} ./backup`)
        const fileDate = moment(new Date()).format('YYYY-MM-DD-HH:mm')
        const fileName = `nodepress-mongodb/backup-${fileDate}.zip`
        const filePath = path.join(BACKUP_DIR_PATH, BACKUP_FILE_NAME)
        logger.info('[expansion]', 'DB Backup 上传文件: ' + fileName)
        logger.info('[expansion]', 'DB Backup 文件源位置: ' + filePath)

        // upload to cloud storage
        this.awsService
          .uploadFile({
            name: fileName,
            file: fs.createReadStream(filePath),
            fileContentType: 'application/zip',
            region: DB_BACKUP.s3Region,
            bucket: DB_BACKUP.s3Bucket,
            classType: 'GLACIER',
            encryption: 'AES256',
          })
          .then((result) => {
            logger.info('[expansion]', 'DB Backup succeed!', result.url)
            resolve(result)
          })
          .catch((error) => {
            logger.warn('[expansion]', 'DB Backup failed!', error)
            reject(JSON.stringify(error.message))
          })
      })
    })
  }
}
