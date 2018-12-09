/**
 * http interface module.
 * @file http 响应接口模块
 * @module interface.http
 * @author Surmon <https://github.com/surmon-china>
 */

// HTTP 状态码
export enum EHttpCode {
  success = 200,
  notFound = 404,
  error = 400,
}

// 业务特征状态码
export enum EHttpStateCode {
  error = 0,
  success = 1,
}

// HTTP 状态返回
export interface IHttpResponseBase {
  code: EHttpStateCode;
  message: string;
}

// HTTP error
export type THttpErrorResponse = IHttpResponseBase & {
  debug: any;
};

// HTTP success 返回
export type THttpSuccessResponse<HttpResponseData> = IHttpResponseBase & {
  result: HttpResponseData;
};

// HTTP Response
export type THttpResponse<T> = THttpErrorResponse | THttpSuccessResponse<T>;
