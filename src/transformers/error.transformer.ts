/**
 * @file Error transform
 * @module transformer/error
 * @author Surmon <https://github.com/surmon-china>
 */

export function getMessageFromNormalError(error: any): any {
  return error?.message || error
}

export function getMessageFromAxiosError(error: any): any {
  return error?.response?.data || getMessageFromNormalError(error)
}
