/**
 * @file Helper IP location service
 * @module module/helper/ip.service
 * @author Surmon <https://github.com/surmon-china>
 */

import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { getMessageFromAxiosError } from '@app/transformers/error.transformer'
import logger from '@app/utils/logger'

export type IP = string
export interface IPLocation {
  country: string
  country_code: string
  region: string
  region_code: string
  city: string
  zip: string
  [key: string]: any
}

@Injectable()
export class IPService {
  constructor(private readonly httpService: HttpService) {}

  // query by https://ip-api.com/docs/api:json
  private queryLocationByIPAPI(ip: IP): Promise<IPLocation> {
    return this.httpService.axiosRef
      .get<any>(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,zip`)
      .then((response) => {
        return response.data?.status !== 'success'
          ? Promise.reject(response.data.message)
          : Promise.resolve({
              country: response.data.country,
              country_code: response.data.countryCode,
              region: response.data.regionName,
              region_code: response.data.region,
              city: response.data.city,
              zip: response.data.zip,
            })
      })
      .catch((error) => {
        const message = getMessageFromAxiosError(error)
        logger.warn('[IP Query]', 'queryLocationByIPAPI failed!', message)
        return Promise.reject(message)
      })
  }

  // query by https://ipapi.co/api/#introduction
  private queryLocationByAPICo(ip: IP): Promise<IPLocation> {
    return this.httpService.axiosRef
      .get<any>(`https://ipapi.co/${ip}/json/`)
      .then((response) => {
        return response.data?.error
          ? Promise.reject(response.data.reason)
          : Promise.resolve({
              country: response.data.country_name,
              country_code: response.data.country_code,
              region: response.data.region,
              region_code: response.data.region_code,
              city: response.data.city,
              zip: response.data.postal,
            })
      })
      .catch((error) => {
        const message = getMessageFromAxiosError(error)
        logger.warn('[IP Query]', 'queryLocationByAPICo failed!', message)
        return Promise.reject(message)
      })
  }

  public queryLocation(ip: IP): Promise<IPLocation | null> {
    return this.queryLocationByIPAPI(ip)
      .catch(() => this.queryLocationByAPICo(ip))
      .catch(() => null)
  }
}
