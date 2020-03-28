/**
 * Helper Ip service.
 * @file Helper Ip 模块服务
 * @module module/helper/ip.service
 * @author Surmon <https://github.com/surmon-china>
 */

// 内存占用太大（~100+M）暂时移除了
// import * as geoip from 'geoip-lite';
import shell from 'shelljs';
import { Injectable, HttpService } from '@nestjs/common';
import { getMessageFromAxiosError } from '@app/transformers/error.transformer';
import * as APP_CONFIG from '@app/app.config';

export type IP = string;
export interface IIPDetail {
  city: string;
  country: string;
}

@Injectable()
export class IPService {
  constructor(private readonly httpService: HttpService) {}

  /*
  // 通过 GEO 库查询
  private queryIPByGeo(ip: IP): IIPDetail {
    return geoip.lookup(ip);
  }
  */

  // 通过阿里云服务查询
  private queryIPByAliyun(ip: IP): Promise<IIPDetail> {
    return this.httpService.axiosRef
      .request({
        headers: { Authorization: `APPCODE ${APP_CONFIG.ALIYUN.ip}` },
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

  // 通过 ip.cn 查询
  private queryIPByIPCN(ip: IP): Promise<IIPDetail> {
    return new Promise((resolve, reject) => {
      shell.exec(`curl https://ip.cn/index.php?ip=${ip}`, (code, out, outError) => {
        try {
          resolve(JSON.parse(out));
        } catch (error) {
          console.warn('IPCN 查询 IP 信息失败！', code, outError, error);
          reject(error);
        }
      })
    })
  }

  // 查询 IP 地址
  public query(ip: IP): Promise<IIPDetail> {
    return this.queryIPByAliyun(ip)
      .then(({ city, country }) => ({ city, country }))
      .catch(() => this.queryIPByIPCN(ip))
      .then(({ city, country }) => ({ city, country }))
      .catch(() => null);
  }
}
