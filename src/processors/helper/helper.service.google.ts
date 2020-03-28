/**
 * Helper Google service.
 * @file Google 证书服务，为全站所有谷歌服务提供证书
 * @module module/helper/google.service
 * @author Surmon <https://github.com/surmon-china>
 */

import { google } from 'googleapis';
import { Credentials, JWT } from 'google-auth-library';
import { Injectable } from '@nestjs/common';
import { getMessageFromNormalError } from '@app/transformers/error.transformer';
import * as APP_CONFIG from '@app/app.config';

@Injectable()
export class GoogleService {

  private jwtClient: JWT = null;

  constructor() {
    this.initClient();
  }

  private initClient() {
    try {
      const key = require(APP_CONFIG.GOOGLE.serverAccountFilePath);
      this.jwtClient = new google.auth.JWT(
        key.client_email,
        null,
        key.private_key,
        [
          'https://www.googleapis.com/auth/indexing', // ping 服务
          'https://www.googleapis.com/auth/analytics.readonly', // GA 服务
        ],
        null,
      );
    } catch (error) {
      console.warn('Google 服务初始化时读取配置文件失败！');
    }
  }

  // 获取证书
  public getCredentials(): Promise<Credentials> {
    return new Promise((resolve, reject) => {
      if (!this.jwtClient) {
        return reject('Google 未成功初始化，无法获取证书！');
      }
      this.jwtClient.authorize((error, credentials: Credentials) => {
        const message = getMessageFromNormalError(error);
        if (message) {
          console.warn('Google 获取证书失败：', message);
          reject(message);
        }
        resolve(credentials);
      });
    });
  }
}
