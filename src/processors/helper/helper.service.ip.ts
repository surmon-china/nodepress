/**
 * Helper Ip service.
 * @file Helper Ip 模块服务
 * @module module/helper/ip.service
 * @author Surmon <https://github.com/surmon-china>
 */

// 内存占用太大（~100+M）暂时移除了
// import * as geoip from 'geoip-lite';
import { Injectable, HttpService } from '@nestjs/common';
import { getMessageFromAxiosError } from '@app/transformers/error.transformer';
import * as APP_CONFIG from '@app/app.config';

export type IP = string;
export interface IPLocation {
  city: string;
  country: string;
}

@Injectable()
export class IPService {
  constructor(private readonly httpService: HttpService) {}

  // 通过 GEO 库查询
  // private queryIPByGeo(ip: IP): IPLocation {
  //   return geoip.lookup(ip);
  // }

  // 通过阿里云服务查询
  private queryIPByAliyun(ip: IP): Promise<IPLocation> {
    return this.httpService.axiosRef
      .request({
        headers: { Authorization: `APPCODE ${APP_CONFIG.COMMON_SERVICE.aliyunIPAuth}` },
        url: `https://api01.aliyun.venuscn.com/ip?ip=${ip}`,
      })
      .then(response => {
        if (response?.data?.ret === 200) {
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

  // 优先通过 https://dashboard.juhe.cn/data/index/my 查询
  private queryIPByJUHE(ip: IP): Promise<any> {
    return this.httpService.axiosRef
      .get(`http://apis.juhe.cn/ip/ipNew?ip=${ip}&key=${APP_CONFIG.COMMON_SERVICE.juheIPAuth}`)
      .then(response => {
        if (response?.data?.resultcode === '200') {
          return Promise.resolve(response.data.result);
        } else {
          return Promise.reject(response.data);
        }
      })
      .catch(error => {
        const message = getMessageFromAxiosError(error);
        console.warn('juhe.cn 查询 IP 信息失败！', message);
        return Promise.reject(message);
      });
  }

  // 查询 IP 地址
  public query(ip: IP): Promise<IPLocation> {
    return this.queryIPByJUHE(ip)
      .then(({ City, Country }) => ({ city: City, country: Country }))
      .catch(() => this.queryIPByAliyun(ip))
      .then(({ city, country }) => ({ city, country }))
      .catch(() => null);
  }
}
