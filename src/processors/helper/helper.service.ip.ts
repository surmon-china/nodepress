/**
 * Helper Ip service.
 * @file Helper Ip 模块服务
 * @module modules/helper/ip.service
 * @author Surmon <https://github.com/surmon-china>
 */

import * as geoip from 'geoip-lite';
import * as APP_CONFIG from '@app/app.config';
import { Injectable, HttpService } from '@nestjs/common';

export type IP = string;
export interface IIPDetail {
  city: string;
  country: string;
}

@Injectable()
export class IpService {
  constructor(private readonly httpService: HttpService) {}

  // 通过阿里云服务查询
  private queryIpByAliyun(ip: IP): Promise<IIPDetail> {
    return this.httpService.axiosRef.request({
      headers: { Authorization: `APPCODE ${APP_CONFIG.ALIYUN.ip}` },
      url: `https://api01.aliyun.venuscn.com/ip?ip=${ip}`,
    }).then(response => {
      const result = JSON.parse(response.data);
      if (result && result.ret === 200) {
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
    return this.queryIpByAliyun(ip)
      .then(({ city, country }) => ({ city, country }))
      .catch(error => Promise.resolve(this.queryIpByGeo(ip)));
  }
}
