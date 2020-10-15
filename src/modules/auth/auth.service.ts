/**
 * Auth service.
 * @file 权限与管理员模块服务
 * @module module/auth/service
 */

import lodash from 'lodash';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@app/transformers/model.transformer';
import { decodeBase64, decodeMd5 } from '@app/transformers/codec.transformer';
import { MongooseModel } from '@app/interfaces/mongoose.interface';
import { ITokenResult } from './auth.interface';
import { Auth } from './auth.model';
import * as APP_CONFIG from '@app/app.config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(Auth) private readonly authModel: MongooseModel<Auth>,
  ) {}

  // 获取已有密码
  private getExtantPassword(auth: Auth): string {
    return auth?.password || decodeMd5(APP_CONFIG.AUTH.defaultPassword as string);
  }

  // 签发 Token
  public createToken(): ITokenResult {
    return {
      access_token: this.jwtService.sign({ data: APP_CONFIG.AUTH.data }),
      expires_in: APP_CONFIG.AUTH.expiresIn as number,
    };
  }

  // 验证 Auth 数据
  public validateAuthData(payload: any): Promise<any> {
    const isVerified = lodash.isEqual(payload.data, APP_CONFIG.AUTH.data);
    return isVerified ? payload.data : null;
  }

  // 获取管理员信息
  public getAdminInfo(): Promise<Auth> {
    return this.authModel.findOne().exec();
  }

  // 修改管理员信息
  public async putAdminInfo(auth: Auth): Promise<Auth> {
    // 密码解码
    const password = decodeBase64(auth.password);
    const new_password = decodeBase64(auth.new_password);
    Reflect.deleteProperty(auth, 'password');
    Reflect.deleteProperty(auth, 'new_password');

    // 验证密码
    if (password || new_password) {
      if (!password || !new_password) {
        throw '密码不完整或无效';
      }
      if (password === new_password) {
        throw '新旧密码不可一致';
      }
    }

    // 获取现存 Auth
    const extantAuth = await this.authModel.findOne(null, '+password').exec();

    // 修改密码 -> 核对已存在密码
    if (password) {
      const oldPassword = decodeMd5(password);
      const extantPassword = this.getExtantPassword(extantAuth);
      if (oldPassword !== extantPassword) {
        throw '原密码不正确';
      } else {
        auth.password = decodeMd5(new_password);
      }
    }

    // 更新或新建数据
    const newAuthData = await (extantAuth && !!extantAuth._id
      ? Object.assign(extantAuth, auth).save()
      : this.authModel.create(auth)
    );
    const authData = newAuthData.toObject() as Auth;
    Reflect.deleteProperty(authData, 'password');
    return authData;
  }

  // 登陆
  public async adminLogin(password: string): Promise<ITokenResult> {
    const auth = await this.authModel.findOne(null, '+password').exec();
    const extantPassword = this.getExtantPassword(auth);
    const loginPassword = decodeMd5(decodeBase64(password));

    if (loginPassword === extantPassword) {
      return this.createToken();
    } else {
      throw '密码不匹配';
    }
  }
}
