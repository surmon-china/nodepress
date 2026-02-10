/**
 * @file System DB backup service
 * @module module/system/dbbackup.service
 * @author Surmon <https://github.com/surmon-china>
 */

import fs from 'fs'
import path from 'path'
import shell from 'shelljs'
import dayjs from 'dayjs'
import { Cron } from '@nestjs/schedule'
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { EmailService } from '@app/core/helper/helper.service.email'
import type { S3FileObject } from '@app/core/helper/helper.service.s3'
import { S3Service, S3ServerSideEncryption } from '@app/core/helper/helper.service.s3'
import { APP_BIZ, MONGO_DB, DB_BACKUP } from '@app/app.config'
import { createLogger } from '@app/utils/logger'
import { isDevEnv } from '@app/app.environment'

const logger = createLogger({ scope: 'DBBackupService', time: isDevEnv })

const BACKUP_DIR_PATH = path.join(APP_BIZ.ROOT_PATH, 'dbbackup')

@Injectable()
export class DBBackupService {
  constructor(
    private readonly emailService: EmailService,
    private readonly s3Service: S3Service
  ) {}

  private async doBackup(): Promise<S3FileObject> {
    // 1. dependency pre-check
    const dependencies = ['mongodump', 'zip']
    for (const dep of dependencies) {
      if (!shell.which(dep)) throw new Error(`missing dependency: [${dep}]`)
    }

    const backupPath = path.join(BACKUP_DIR_PATH, 'backup')
    const backupPrevPath = path.join(BACKUP_DIR_PATH, 'backup.prev')

    // 2. cleanup physical paths
    shell.rm('-rf', backupPrevPath)
    shell.test('-d', backupPath) && shell.mv(backupPath, backupPrevPath)
    shell.mkdir('-p', backupPath)

    // 3. database export
    // https://dba.stackexchange.com/questions/215534/mongodump-unrecognized-field-snapshot
    // https://www.mongodb.com/docs/database-tools/mongodump/#std-option-mongodump.--quiet
    const dumpCmd = `mongodump --quiet --forceTableScan --uri="${MONGO_DB.uri}" --out="${backupPath}"`
    const dumpResult = shell.exec(dumpCmd)
    if (dumpResult.code !== 0) throw new Error(`mongodump failed: ${dumpResult.stderr}`)
    logger.log('mongodump succeeded:', `${shell.ls(`${backupPath}/*`).length} files`)

    // 4. compress backup files
    // tar -czf - backup | openssl des3 -salt -k <password> -out target.tar.gz
    const zipPath = path.join(BACKUP_DIR_PATH, 'nodepress.zip')
    const zipResult = shell.exec(`zip -q -r -j -P ${DB_BACKUP.password} "${zipPath}" "${backupPath}"`)
    if (zipResult.code !== 0) throw new Error(`zip failed: ${zipResult.stderr}`)

    const fileDate = dayjs(new Date()).format('YYYY-MM-DD-HH-mm')
    const fileName = `nodepress-mongodb-backup_${fileDate}.zip`
    logger.log(`file path: ${zipPath}`)
    logger.log(`file key: ${fileName}`)

    // 5. Upload to cloud storage
    return this.s3Service
      .uploadFile({
        key: fileName,
        file: fs.createReadStream(zipPath),
        fileContentType: 'application/zip',
        region: DB_BACKUP.s3Region,
        bucket: DB_BACKUP.s3Bucket,
        // MARK: To avoid the high cost of IA storage in R2, the standard storage class is used here.
        // classType: S3StorageClass.STANDARD_IA,
        encryption: S3ServerSideEncryption.AES256
      })
      .then((result) => {
        logger.success('upload succeeded:', result.key)
        return result
      })
      .catch((error) => {
        const errorMessage = String(error.message ?? error)
        logger.failure('upload failed!', errorMessage)
        throw errorMessage
      })
  }

  private mailToAdmin(subject: string, content: string, isCode?: boolean) {
    this.emailService.sendMailAs(APP_BIZ.NAME, {
      to: APP_BIZ.ADMIN_EMAIL,
      subject,
      text: `${subject}, detail: ${content}`,
      html: `${subject} <br> ${isCode ? `<pre>${content}</pre>` : content}`
    })
  }

  // Auto-backup database and notify admin via email at 03:00.
  @Cron('0 0 3 * * *', { name: 'DailyDatabaseBackupJob' })
  public async backup() {
    try {
      const result = await this.doBackup()
      const json = {
        ...result,
        lastModified: result.lastModified?.toLocaleString('zh'),
        size: (result.size / 1024).toFixed(2) + 'kb'
      }
      this.mailToAdmin('Database backup succeeded', JSON.stringify(json, null, 2), true)
      return result
    } catch (error: unknown) {
      this.mailToAdmin('Database backup failed!', String(error))
      throw new InternalServerErrorException(String(error))
    }
  }
}
