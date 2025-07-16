/**
 * @file Admin service
 * @module module/admin/service
 */

import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common'
import { InjectModel } from '@app/transformers/model.transformer'
import { MongooseModel } from '@app/interfaces/mongoose.interface'
import { AuthService } from '@app/core/auth/auth.service'
import { decodeBase64, decodeMD5 } from '@app/transformers/codec.transformer'
import { Admin, DEFAULT_ADMIN_PROFILE } from './admin.model'
import { TokenResult } from './admin.interface'
import { AdminUpdateDTO } from './admin.dto'
import { APP_BIZ } from '@app/app.config'

@Injectable()
export class AdminService {
  constructor(
    private readonly authService: AuthService,
    @InjectModel(Admin) private readonly adminModel: MongooseModel<Admin>
  ) {}

  private async getExistedPassword(): Promise<string> {
    const auth = await this.adminModel.findOne(undefined, '+password').exec()
    return auth?.password || decodeMD5(APP_BIZ.AUTH.defaultPassword)
  }

  public createToken(): TokenResult {
    return {
      access_token: this.authService.signToken(),
      expires_in: APP_BIZ.AUTH.expiresIn
    }
  }

  public async login(password: string): Promise<TokenResult> {
    const existedPassword = await this.getExistedPassword()
    const loginPassword = decodeMD5(decodeBase64(password))
    if (loginPassword === existedPassword) {
      return this.createToken()
    } else {
      throw new UnauthorizedException('Password incorrect')
    }
  }

  public async getProfile(): Promise<Admin> {
    const adminProfile = await this.adminModel.findOne(undefined, '-_id').exec()
    return adminProfile ? adminProfile.toObject() : DEFAULT_ADMIN_PROFILE
  }

  public async updateProfile(adminProfile: AdminUpdateDTO): Promise<Admin> {
    const { password, new_password, ...profile } = adminProfile
    const payload: Admin = { ...profile }

    // verify password
    if (password || new_password) {
      if (!password || !new_password) {
        throw new BadRequestException('Incomplete passwords')
      }
      if (password === new_password) {
        throw new BadRequestException('Old password and new password cannot be the same')
      }
      const oldPassword = decodeMD5(decodeBase64(password))
      const existedPassword = await this.getExistedPassword()
      if (oldPassword !== existedPassword) {
        throw new BadRequestException('Old password incorrect')
      }
      // set new password
      payload.password = decodeMD5(decodeBase64(new_password))
    }

    // save
    const existedAuth = await this.adminModel.findOne(undefined, '+password').exec()
    if (existedAuth) {
      await Object.assign(existedAuth, payload).save()
    } else {
      await this.adminModel.create(payload)
    }

    return this.getProfile()
  }
}
