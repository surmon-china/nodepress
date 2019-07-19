/**
 * Helper Ip service.
 * @file Helper Ip 模块服务
 * @module module/helper/ip.service
 * @author Surmon <https://github.com/surmon-china>
 */

import * as geoip from 'geoip-lite';
import * as APP_CONFIG from '@app/app.config';
import { Injectable, HttpService } from '@nestjs/common';
import { getMessageFromAxiosError } from '@app/transforms/error.transform';

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
    return this.httpService.axiosRef
      .request({
        headers: { Authorization: `APPCODE ${APP_CONFIG.ALIYUN.ip}` },
        url: `https://api01.aliyun.venuscn.com/ip?ip=${ip}`,
      })
      .then(response => {
        if (response.data && response.data.ret === 200) {
          return Promise.resolve(response.data.data);
        } else {
          return Promise.reject(response.data);
        }
      })
      .catch(error => {
        const message = getMessageFromAxiosError(error);
        console.warn('Aliyun 查询 IP 信息失败！', message);
        return Promise.reject(message);
      });
  }

  // 通过 GEO 库查询
  private queryIpByGeo(ip: IP): IIPDetail {
    return geoip.lookup(ip);
  }

  // 查询 IP 地址
  public query(ip: IP): Promise<IIPDetail> {
    return this.queryIpByAliyun(ip)
      .then(({ city, country }) => ({ city, country }))
      .catch(() => Promise.resolve(this.queryIpByGeo(ip)));
  }
}
