/**
 * Expansion cloud storage service.
 * @file 扩展模块 cloud storage 服务
 * @module module/expansion/cs.service
 * @author Surmon <https://github.com/surmon-china>
 */

import OSS from 'ali-oss';
import { Injectable } from '@nestjs/common';
import * as APP_CONFIG from '@app/app.config';

const STS = (OSS as any).STS;

export interface IUpToken {
  AccessKeyId: string;
  AccessKeySecret: string;
  SecurityToken: string;
  Expiration: string;
}

@Injectable()
export class CloudStorageService {

  private sts: typeof STS;

  constructor() {
    this.sts = new STS({
      accessKeyId: APP_CONFIG.CLOUD_STORAGE.accessKey,
      accessKeySecret: APP_CONFIG.CLOUD_STORAGE.secretKey,
    });
  }

  // 获取临时 Token
  public async getToken(): Promise<IUpToken> {
    const response = await this.sts.assumeRole(
      APP_CONFIG.CLOUD_STORAGE.aliyunAcsARN,
      null,
      15 * 60,
      'session-name',
    );
    return response.credentials;
  }

  // 上传文件
  public async uploadFile(name: string, file: any, region: string, bucket: string) {
    return this.getToken().then(token => {
      let client = new OSS({
        region,
        bucket,
        accessKeyId: token.AccessKeyId,
        accessKeySecret: token.AccessKeySecret,
        stsToken: token.SecurityToken,
        secure: true,
      });
      return client.put(name, file).finally(() => {
        client = null;
      });
    });
  }
}
