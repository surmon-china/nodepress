/**
 * Helper Google service.
 * @file Helper Google credentials service
 * @module module/helper/google.service
 * @author Surmon <https://github.com/surmon-china>
 */

import { google } from 'googleapis'
import { Credentials, JWT } from 'google-auth-library'
import { Injectable } from '@nestjs/common'
import { getMessageFromNormalError } from '@app/transformers/error.transformer'
import { UNDEFINED } from '@app/constants/value.constant'
import * as APP_CONFIG from '@app/app.config'
import logger from '@app/utils/logger'

@Injectable()
export class GoogleService {
  private jwtClient: JWT | null = null

  constructor() {
    this.initClient()
  }

  private initClient() {
    try {
      this.jwtClient = new google.auth.JWT(
        APP_CONFIG.GOOGLE.jwtServiceAccountCredentials?.client_email,
        UNDEFINED,
        APP_CONFIG.GOOGLE.jwtServiceAccountCredentials?.private_key,
        [
          'https://www.googleapis.com/auth/indexing', // ping service
          'https://www.googleapis.com/auth/analytics.readonly', // GA service
        ],
        UNDEFINED
      )
    } catch (error) {
      logger.warn('[GoogleAPI]', 'client initialization failed!')
    }
  }

  // get credentials for client
  public getCredentials(): Promise<Credentials> {
    return new Promise((resolve, reject) => {
      if (!this.jwtClient) {
        return reject('[GoogleAPI] client initialization failed!')
      }
      this.jwtClient.authorize((error, credentials: Credentials) => {
        const message = getMessageFromNormalError(error)
        if (message) {
          logger.warn('[GoogleAPI]', 'jwt authorize failed: ', message)
          reject(message)
        }
        resolve(credentials)
      })
    })
  }
}
