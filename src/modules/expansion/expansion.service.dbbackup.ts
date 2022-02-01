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
import { CloudStorageService } from '@app/processors/helper/helper.service.cs'
import { APP, MONGO_DB, DB_BACKUP } from '@app/app.config'
import logger from '@app/utils/logger'

const UP_FAILED_TIMEOUT = 1000 * 60 * 5
const UPLOAD_INTERVAL = '0 0 3 * * *'
const BACKUP_FILE_NAME = 'nodepress.tar.gz'
const BACKUP_DIR_PATH = path.join(APP.ROOT_PATH, 'dbbackup')

@Injectable()
export class DBBackupService {
  constructor(
    private readonly emailService: EmailService,
    private readonly cloudStorageService: CloudStorageService
  ) {
    logger.info('[expansion]', 'DB Backup 开始执行定时数据备份任务！')
    schedule.scheduleJob(UPLOAD_INTERVAL, () => {
      this.backup().catch(() => {
        setTimeout(this.backup, UP_FAILED_TIMEOUT)
      })
    })
  }

  public async backup(): Promise<string> {
    try {
      const result = await this.doBackup()
      this.mailToAdmin('Database backup succeed', JSON.stringify(result, null, 2))
      return result.name
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
    return new Promise<{ url: string; name: string }>((resolve, reject) => {
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

        shell.exec(`tar -czf ${BACKUP_FILE_NAME} ./backup`)
        const fileDate = moment(new Date()).format('YYYY-MM-DD-HH:mm')
        const fileName = `nodepress-mongodb/backup-${fileDate}.tar.gz`
        const filePath = path.join(BACKUP_DIR_PATH, BACKUP_FILE_NAME)
        logger.info('[expansion]', 'DB Backup 上传文件: ' + fileName)
        logger.info('[expansion]', 'DB Backup 文件源位置: ' + filePath)

        // 上传文件
        this.cloudStorageService
          .uploadFile(fileName, filePath, DB_BACKUP.region, DB_BACKUP.bucket)
          .then((result) => {
            const data = {
              name: result.name,
              url: result.url,
              data: result.data,
            }
            logger.info('[expansion]', 'DB Backup succeed!', data)
            resolve(data)
          })
          .catch((error) => {
            logger.warn('[expansion]', 'DB Backup failed!', error)
            reject(JSON.stringify(error.message))
          })
      })
    })
  }
}
