/**
 * http interface module.
 * @file http 响应接口模块
 * @module interface.http
 * @author Surmon <https://github.com/surmon-china>
 */

export enum EStatus {
  Error = 'error',
  Success = 'success',
}

// HTTP 状态返回
export interface IHttpResponseBase {
  status: EStatus;
  message: string;
}

// HTTP error
export type THttpErrorResponse = IHttpResponseBase & {
  error: any;
  debug?: string
};

// HTTP success 返回
export type THttpSuccessResponse<T> = IHttpResponseBase & {
  result: T;
};

// HTTP Response
export type THttpResponse<T> = THttpErrorResponse | THttpSuccessResponse<T>;
