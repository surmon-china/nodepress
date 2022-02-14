/**
 * @file Expansion Aliyun cloud storage service
 * @module module/expansion/cloud-storage.service
 * @author Surmon <https://github.com/surmon-china>
 */

import OSS from 'ali-oss'
import { Injectable } from '@nestjs/common'
import * as APP_CONFIG from '@app/app.config'

const STS = (OSS as any).STS

export interface UploadToken {
  AccessKeyId: string
  AccessKeySecret: string
  SecurityToken: string
  Expiration: string
}

@Injectable()
export class CloudStorageService {
  private sts: typeof STS

  constructor() {
    this.sts = new STS({
      accessKeyId: APP_CONFIG.ALIYUN_CLOUD_STORAGE.accessKey,
      accessKeySecret: APP_CONFIG.ALIYUN_CLOUD_STORAGE.secretKey,
    })
  }

  // get upload Token
  public async getToken(): Promise<UploadToken> {
    const response = await this.sts.assumeRole(
      APP_CONFIG.ALIYUN_CLOUD_STORAGE.aliyunAcsARN,
      null,
      15 * 60,
      'session-name'
    )
    return response.credentials
  }

  public async uploadFile(name: string, file: any, region: string, bucket: string) {
    return this.getToken().then((token) => {
      let client: OSS | null = new OSS({
        region,
        bucket,
        accessKeyId: token.AccessKeyId,
        accessKeySecret: token.AccessKeySecret,
        stsToken: token.SecurityToken,
        secure: true,
      })
      return client.put(name, file).finally(() => {
        client = null
      })
    })
  }
}
