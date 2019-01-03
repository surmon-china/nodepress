/**
 * Auth service.
 * @file 权限与管理员模块服务
 * @module module/auth/service
 * @author Surmon <https://github.com/surmon-china>
 */

import * as lodash from 'lodash';
import * as APP_CONFIG from '@app/app.config';
import { Base64 } from 'js-base64';
import { createHash } from 'crypto';
import { InjectModel } from 'nestjs-typegoose';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TMongooseModel } from '@app/interfaces/mongoose.interface';
import { ITokenResult } from './auth.interface';
import { Auth } from './auth.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(Auth) private readonly authModel: TMongooseModel<Auth>,
  ) {}

  // 验证 Auth 数据
  validateAuthData(payload: any): Promise<any> {
    const isVerified = lodash.isEqual(payload.data, APP_CONFIG.AUTH.data);
    return isVerified ? payload.data : null;
  }

  // 密码编码
  private decodeBase64(password) {
    return password ? Base64.decode(password) : password;
  }

  // md5编码
  private decodeMd5(password) {
    return createHash('md5').update(password).digest('hex');
  }

  // 获取管理员信息
  async getAdminInfo(): Promise<Auth> {
    return this.authModel.findOne(null, '-_id name slogan gravatar');
  }

  // 修改管理员信息
  putAdminInfo(auth: Auth): Promise<Auth> {
    return new Promise((resolve, reject) => {

      // 密码解码
      const password = this.decodeBase64(auth.password);
      const new_password = this.decodeBase64(auth.new_password);
      const rel_new_password = this.decodeBase64(auth.rel_new_password);

      // 验证密码
      if (password || new_password || rel_new_password) {
        const isLackConfirmPassword = !new_password || !rel_new_password;
        const isDissimilarityConfirmPassword = new_password !== rel_new_password;
        const isIncludeOldPassword = [new_password, rel_new_password].includes(password);
        // 判定密码逻辑
        if (isLackConfirmPassword || isDissimilarityConfirmPassword) {
          return reject('密码不一致或无效');
        }
        if (isIncludeOldPassword) {
          return reject('新旧密码不可一致');
        }
      }

      // 修改前查询验证
      this.authModel.findOne(null, '_id name slogan gravatar password')
        .then(_auth => {

          // 已存在密码
          const extantAuth = _auth || { _id: null, password: null };
          const extantPassword = extantAuth.password || this.decodeMd5(APP_CONFIG.AUTH.defaultPassword);

          // 修改密码 -> 判断旧密码是否一致
          if (password) {
            if (extantPassword !== this.decodeMd5(password)) {
              return reject('原密码不正确');
            } else {
              auth.password = this.decodeMd5(rel_new_password);
              Reflect.deleteProperty(auth, 'new_password');
              Reflect.deleteProperty(auth, 'rel_new_password');
            }
          }

          const getAdminInfo = () => {
            this.getAdminInfo().then(resolve).catch(reject);
          };

          if (extantAuth._id) {
            this.authModel.findByIdAndUpdate(extantAuth._id, auth, { new: true }).then(getAdminInfo).catch(reject);
          } else {
            new this.authModel(auth).save().then(getAdminInfo).catch(reject);
          }

        }).catch(reject);
    });
  }

  // 登陆/创建 Token
  createToken(password: string): Promise<ITokenResult> {
    return this.authModel.findOne(null, '-_id password').then(auth => {
      const extantAuth = auth || { password: null };
      const extantPassword = extantAuth.password || this.decodeMd5(APP_CONFIG.AUTH.defaultPassword);
      const submittedPassword = this.decodeMd5(this.decodeBase64(password));
      if (submittedPassword === extantPassword) {
        const accessToken = this.jwtService.sign({ data: APP_CONFIG.AUTH.data });
        return Promise.resolve({ accessToken, expiresIn: APP_CONFIG.AUTH.expiresIn });
      } else {
        return Promise.reject('密码不匹配');
      }
    }).catch(error => {
      return Promise.reject(error);
    });
  }
}
