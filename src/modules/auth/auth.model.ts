/**
 * Auth model.
 * @file 权限和用户数据模型
 * @module module/auth/model
 * @author Surmon <https://github.com/surmon-china>
 */

import { prop, Typegoose } from 'typegoose';
import { IsString, IsDefined, IsNotEmpty } from 'class-validator';
import { getModelBySchema, getProviderByModel } from '@app/transforms/model.transform';

export class Auth extends Typegoose {

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
  @prop()
  password?: string;

  new_password?: string;
}

export class AuthLogin extends Typegoose {

  @IsDefined()
  @IsNotEmpty({ message: '密码？' })
  @IsString({ message: '字符串？' })
  password: string;
}

export const AuthModel = getModelBySchema(Auth);
export const AuthProvider = getProviderByModel(AuthModel);
