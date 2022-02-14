/**
 * @file Auth service
 * @module module/auth/service
 */

import lodash from 'lodash'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UNDEFINED } from '@app/constants/value.constant'
import { InjectModel } from '@app/transformers/model.transformer'
import { decodeBase64, decodeMD5 } from '@app/transformers/codec.transformer'
import { MongooseModel } from '@app/interfaces/mongoose.interface'
import { TokenResult } from './auth.interface'
import { Auth, DEFAULT_AUTH } from './auth.model'
import { AuthUpdateDTO } from './auth.dto'
import * as APP_CONFIG from '@app/app.config'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(Auth) private readonly authModel: MongooseModel<Auth>
  ) {}

  private async getExistedPassword(): Promise<string> {
    const auth = await this.authModel.findOne(UNDEFINED, '+password').exec()
    return auth?.password || decodeMD5(APP_CONFIG.AUTH.defaultPassword as string)
  }

  public createToken(): TokenResult {
    return {
      access_token: this.jwtService.sign({ data: APP_CONFIG.AUTH.data }),
      expires_in: APP_CONFIG.AUTH.expiresIn as number,
    }
  }

  public validateAuthData(payload: any): Promise<any> {
    const isVerified = lodash.isEqual(payload.data, APP_CONFIG.AUTH.data)
    return isVerified ? payload.data : null
  }

  public async getAdminInfo(): Promise<Auth> {
    const adminInfo = await this.authModel.findOne(UNDEFINED, '-_id').exec()
    return adminInfo ? adminInfo.toObject() : DEFAULT_AUTH
  }

  public async putAdminInfo(auth: AuthUpdateDTO): Promise<Auth> {
    const { password, new_password, ...restAuth } = auth

    let newPassword: string | void
    if (password || new_password) {
      // verify password
      if (!password || !new_password) {
        throw 'Incomplete passwords'
      }
      if (password === new_password) {
        throw 'Old password and new password cannot be same'
      }

      // update password
      const oldPassword = decodeMD5(decodeBase64(password))
      const existedPassword = await this.getExistedPassword()
      if (oldPassword !== existedPassword) {
        throw 'Old password incorrect'
      } else {
        newPassword = decodeMD5(decodeBase64(new_password))
      }
    }

    // data
    const targetAuthData: Auth = { ...restAuth }
    if (newPassword) {
      targetAuthData.password = newPassword
    }

    // save
    const existedAuth = await this.authModel.findOne(UNDEFINED, '+password').exec()
    if (existedAuth) {
      await Object.assign(existedAuth, targetAuthData).save()
    } else {
      await this.authModel.create(targetAuthData)
    }

    return this.getAdminInfo()
  }

  public async adminLogin(password: string): Promise<TokenResult> {
    const existedPassword = await this.getExistedPassword()
    const loginPassword = decodeMD5(decodeBase64(password))
    if (loginPassword === existedPassword) {
      return this.createToken()
    } else {
      throw 'Password incorrect'
    }
  }
}
