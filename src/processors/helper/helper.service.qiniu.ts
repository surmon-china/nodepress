/**
 * Expansion Qiniu service.
 * @file 扩展模块 Qiniu 服务
 * @module module/expansion/qiniu.service
 * @author Surmon <https://github.com/surmon-china>
 */

import * as qiniu from 'qiniu';
import * as APP_CONFIG from '@app/app.config';
import { Injectable } from '@nestjs/common';

export interface IUpToken {
  up_token: string;
}

@Injectable()
export class QiniuService {

  private mac: qiniu.auth.digest.Mac;
  private putPolicy: qiniu.rs.PutPolicy;

  constructor() {
    const { bucket, accessKey, secretKey } = APP_CONFIG.QINIU;
    this.mac = new qiniu.auth.digest.Mac(accessKey as string, secretKey as string);
    this.putPolicy = new qiniu.rs.PutPolicy({ scope: bucket as string });
  }

  public getToken(): IUpToken {
    return {
      up_token: this.putPolicy.uploadToken(this.mac),
    };
  }

  // 上传文件

  // 管理文件
}
