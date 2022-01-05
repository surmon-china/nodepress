/**
 * @file Helper Email service
 * @module processor/helper/email.service
 * @author Surmon <https://github.com/surmon-china>
 */

import nodemailer from 'nodemailer'
import { Injectable } from '@nestjs/common'
import { getMessageFromNormalError } from '@app/transformers/error.transformer'
import * as APP_CONFIG from '@app/app.config'
import logger from '@app/utils/logger'

export interface EmailOptions {
  to: string
  subject: string
  text: string
  html: string
}

@Injectable()
export class EmailService {
  private transporter: nodemailer
  private clientIsValid: boolean

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.qq.com',
      secure: true,
      port: 465,
      auth: {
        user: APP_CONFIG.EMAIL.account,
        pass: APP_CONFIG.EMAIL.password,
      },
    })
    this.verifyClient()
  }

  private verifyClient(): void {
    return this.transporter.verify((error) => {
      if (error) {
        this.clientIsValid = false
        setTimeout(this.verifyClient.bind(this), 1000 * 60 * 30)
        logger.error(`[NodeMailer]`, `客户端初始化连接失败！将在半小时后重试`, getMessageFromNormalError(error))
      } else {
        this.clientIsValid = true
        logger.info('[NodeMailer]', '客户端初始化连接成功！随时可发送邮件')
      }
    })
  }

  public sendMail(mailOptions: EmailOptions) {
    if (!this.clientIsValid) {
      logger.warn('[NodeMailer]', '由于未初始化成功，邮件客户端发送被拒绝！')
      return false
    }
    const options = Object.assign(mailOptions, { from: APP_CONFIG.EMAIL.from })
    this.transporter.sendMail(options, (error, info) => {
      if (error) {
        logger.error(`[NodeMailer]`, `邮件发送失败`, getMessageFromNormalError(error))
      } else {
        logger.info('[NodeMailer]', '邮件发送成功', info.messageId, info.response)
      }
    })
  }
}
