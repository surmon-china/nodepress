/**
 * @file Google API service
 * @module module/helper/google.service
 * @author Surmon <https://github.com/surmon-china>
 */

import { google, Auth, analyticsdata_v1beta } from 'googleapis'
import { Injectable } from '@nestjs/common'
import { getMessageFromNormalError } from '@app/transformers/error.transformer'
import { createLogger } from '@app/utils/logger'
import { isDevEnv } from '@app/app.environment'
import * as APP_CONFIG from '@app/app.config'

const logger = createLogger({ scope: 'GoogleAPIService', time: isDevEnv })

@Injectable()
export class GoogleService {
  private authJWT: Auth.JWT | null = null
  private analyticsDataClient: analyticsdata_v1beta.Analyticsdata | null = null

  constructor() {
    try {
      // auth client
      this.authJWT = new google.auth.JWT({
        email: APP_CONFIG.GOOGLE.jwtServiceAccountCredentials?.client_email,
        key: APP_CONFIG.GOOGLE.jwtServiceAccountCredentials?.private_key,
        scopes: [
          'https://www.googleapis.com/auth/indexing', // ping service
          'https://www.googleapis.com/auth/analytics.readonly' // GA service
        ]
      })
      // Google analytics v4
      this.analyticsDataClient = google.analyticsdata({
        version: 'v1beta',
        auth: this.authJWT
      })
    } catch (error) {
      logger.failure('authJWT initialization failed!', error)
    }
  }

  public getAuthCredentials(): Promise<Auth.Credentials> {
    return new Promise((resolve, reject) => {
      if (!this.authJWT) {
        reject('GoogleAPI authJWT initialization failed!')
      } else {
        this.authJWT.authorize((error, credentials: Auth.Credentials) => {
          const message = getMessageFromNormalError(error)
          if (message) {
            logger.warn('authJWT authorize failed!', message)
            reject(message)
          } else {
            resolve(credentials)
          }
        })
      }
    })
  }

  // https://github.com/datopian/frontend-v2/blob/f172ea1262bea1f930b767c082c3915f317dde2e/plugins/google-analytics/api.js#L25
  // https://github.com/dtinth/sheet.spacet.me/blob/bed73b061f0bded0c1c406011ecd3cdd2dd8f47a/api/statistics.js#L4
  // https://github.com/Andro999b/movies-telegram-bot/blob/c5697681dead5df22e847e784a93c0a16f3af2fc/analytics/functions/handlers/ga4.ts#L46
  // https://developers.google.com/analytics/devguides/reporting/data/v1
  // https://developers.google.com/analytics/devguides/reporting/data/v1/basics
  public getAnalyticsDataClient() {
    if (!this.authJWT || !this.analyticsDataClient) {
      throw new Error('Google Analytics Data client is not ready.')
    } else {
      return this.analyticsDataClient
    }
  }
}
