/**
 * @file Google credentials service
 * @module module/helper/google.service
 * @author Surmon <https://github.com/surmon-china>
 */

import { google, Auth } from 'googleapis'
import { Injectable } from '@nestjs/common'
import { getMessageFromNormalError } from '@app/transformers/error.transformer'
import { UNDEFINED } from '@app/constants/value.constant'
import * as APP_CONFIG from '@app/app.config'
import logger from '@app/utils/logger'

const log = logger.scope('GoogleService')

@Injectable()
export class GoogleService {
  private jwtClient: Auth.JWT | null = null

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
          'https://www.googleapis.com/auth/analytics.readonly' // GA service
        ],
        UNDEFINED
      )
    } catch (error) {
      log.warn('client initialization failed!')
    }
  }

  // get credentials for client
  public getCredentials(): Promise<Auth.Credentials> {
    return new Promise((resolve, reject) => {
      if (!this.jwtClient) {
        return reject('GoogleAPI client initialization failed!')
      }
      this.jwtClient.authorize((error, credentials: Auth.Credentials) => {
        const message = getMessageFromNormalError(error)
        if (message) {
          log.warn('JWT authorize failed!', message)
          reject(message)
        }
        resolve(credentials)
      })
    })
  }
}
