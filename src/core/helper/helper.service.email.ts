/**
 * @file Email service
 * @module core/helper/email.service
 * @author Surmon <https://github.com/surmon-china>
 */

import nodemailer from 'nodemailer'
import { Injectable, OnModuleInit } from '@nestjs/common'
import { getMessageFromNormalError } from '@app/transformers/error.transformer'
import { createLogger } from '@app/utils/logger'
import { isDevEnv } from '@app/app.environment'
import * as APP_CONFIG from '@app/app.config'

const logger = createLogger({ scope: 'EmailService', time: isDevEnv })

export interface EmailOptions {
  to: string
  subject: string
  text: string
  html: string
}

@Injectable()
export class EmailService implements OnModuleInit {
  private transporter: nodemailer.Transporter
  private clientIsValid: boolean

  constructor() {
    // https://nodemailer.com/
    this.transporter = nodemailer.createTransport({
      host: APP_CONFIG.EMAIL.host,
      port: APP_CONFIG.EMAIL.port,
      secure: false,
      auth: {
        user: APP_CONFIG.EMAIL.account,
        pass: APP_CONFIG.EMAIL.password
      }
    })
  }

  async onModuleInit() {
    try {
      // https://nodemailer.com/usage#verify-the-connection-optional
      await this.transporter.verify()
      this.clientIsValid = true
      logger.success('client initialized.')
    } catch {
      this.clientIsValid = false
      logger.failure('client initialization failed! (canot connect to SMTP server)')
    }
  }

  public sendMail(mailOptions: EmailOptions) {
    if (!this.clientIsValid) {
      logger.warn('send failed! (initialization failed)')
      return false
    }

    if (!mailOptions.to) {
      logger.warn('send failed! (no recipient)')
      return false
    }

    this.transporter.sendMail(
      {
        ...mailOptions,
        from: APP_CONFIG.EMAIL.from
      },
      (error, info) => {
        if (error) {
          logger.failure('send failed!', getMessageFromNormalError(error))
        } else {
          logger.success('send succeeded.', info.messageId, info.response)
        }
      }
    )
  }

  public sendMailAs(prefix: string, mailOptions: EmailOptions) {
    return this.sendMail({
      ...mailOptions,
      subject: `[${prefix}] ${mailOptions.subject}`
    })
  }
}
