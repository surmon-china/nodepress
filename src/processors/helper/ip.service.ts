/**
 * Extended Ip service.
 * @file Extended Ip 模块服务
 * @module modules/helper/ip.service
 * @author Surmon <https://github.com/surmon-china>
 */

import * as geoip from 'geoip-lite';
import * as APP_CONFIG from '@app/app.config';
import { Injectable, HttpService } from '@nestjs/common';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export type IP = string;
export interface IIPDetail {

}

@Injectable()
export class IpService {
  constructor(private readonly httpService: HttpService) {}

  // 通过阿里云服务查询
  private queryIpByAliyun(ip: IP): Promise<IIPDetail> {
    return this.httpService.axiosRef.request({
      headers: { Authorization: `APPCODE ${APP_CONFIG.ALIYUN.ip}` },
      url: `https://dm-81.data.aliyun.com/rest/160601/ip/getIpInfo.json?ip=${ip}`,
    }).then(response => {
      const result = JSON.parse(response.data);
      if (result && result.code === 0) {
        return Promise.resolve(result.data);
      } else {
        return Promise.reject(result);
      }
    }).catch(error => {
      return Promise.reject(error);
    });
  }

  // 通过 GEO 库查询
  private queryIpByGeo(ip: IP): IIPDetail {
    return geoip.lookup(ip);
  }

  // 查询 IP 地址
  query(ip: IP): Promise<IIPDetail> {
    return this.queryIpByAliyun(ip).catch(error => Promise.resolve(this.queryIpByGeo(ip)));
  }
}
