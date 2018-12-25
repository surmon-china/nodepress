/**
 * Utils Qiniu service.
 * @file Utils Qiniu 模块服务
 * @module modules/utils/qiniu.service
 * @author Surmon <https://github.com/surmon-china>
 */

import * as qiniu from 'qiniu';
import * as APP_CONFIG from '@app/app.config';
import { Injectable } from '@nestjs/common';

export interface IUpToken {
  upToken: string;
}

@Injectable()
export class QiniuService {

  private mac: qiniu.auth.digest.Mac;
  private putPolicy: qiniu.rs.PutPolicy;

  constructor() {
    const { bucket, accessKey, secretKey } = APP_CONFIG.QINIU;
    this.mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    this.putPolicy = new qiniu.rs.PutPolicy({ scope: bucket });
  }

  getToken(): IUpToken {
    return { upToken: this.putPolicy.uploadToken(this.mac) };
  }
}