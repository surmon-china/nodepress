/**
 * Auth interface.
 * @file 权限模块公共接口
 * @module module/auth/interface
 * @author Surmon <https://github.com/surmon-china>
 */

export interface ITokenResult {
  accessToken: string;
  expiresIn: number;
}
