/**
 * Auth model.
 * @file 权限和用户数据模型
 * @module module/auth/model
 * @author Surmon <https://github.com/surmon-china>
 */

import { prop } from '@typegoose/typegoose';
import { IsString, IsDefined, IsNotEmpty } from 'class-validator';
import { getProviderByTypegooseClass } from '@app/transformers/model.transformer';

export class Auth {
  @IsDefined()
  @IsString({ message: '名字？' })
  @prop({ default: '' })
  name: string;

  @IsDefined()
  @IsString({ message: '你的口号呢？' })
  @prop({ default: '' })
  slogan: string;

  @IsDefined()
  @IsString({ message: '头像？' })
  @prop({ default: '' })
  gravatar: string;

  @IsString()
  @prop({ select: false })
  password?: string;

  new_password?: string;
}

export class AuthLogin {
  @IsDefined()
  @IsNotEmpty({ message: '密码？' })
  @IsString({ message: '字符串？' })
  password: string;
}

export const AuthProvider = getProviderByTypegooseClass(Auth);
