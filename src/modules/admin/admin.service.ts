/**
 * @file Admin service
 * @module module/admin/service
 */

import bcrypt from 'bcryptjs'
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common'
import { InjectModel } from '@app/transformers/model.transformer'
import { MongooseModel } from '@app/interfaces/mongoose.interface'
import { AuthService } from '@app/core/auth/auth.service'
import { decodeBase64 } from '@app/transformers/codec.transformer'
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

  /**
   * Validate the provided plain password against the stored password.
   * - If a hashed password exists in the database, verify with bcrypt.
   * - If no password exists (e.g., initial state), fall back to comparing with the default password.
   */
  private async validatePassword(plainPassword: string): Promise<boolean> {
    const existedProfile = await this.adminModel.findOne().select('+password').exec()
    if (existedProfile?.password) {
      // Password exists in database → validate using bcrypt
      return await bcrypt.compare(plainPassword, existedProfile.password)
    } else {
      // No password in database → compare directly with default password (no hashing)
      return plainPassword === APP_BIZ.PASSWORD.defaultPassword
    }
  }

  public createToken(): TokenResult {
    return {
      access_token: this.authService.signToken(),
      expires_in: APP_BIZ.AUTH_JWT.expiresIn
    }
  }

  public async login(base64Password: string): Promise<TokenResult> {
    if (await this.validatePassword(decodeBase64(base64Password))) {
      return this.createToken()
    } else {
      throw new UnauthorizedException('Password incorrect')
    }
  }

  public async getProfile(): Promise<Admin> {
    const adminProfile = await this.adminModel.findOne().select('-_id').lean().exec()
    return adminProfile ?? DEFAULT_ADMIN_PROFILE
  }

  public async updateProfile(adminProfile: AdminUpdateDTO): Promise<Admin> {
    const { password: inputOldPassword, new_password: inputNewPassword, ...profile } = adminProfile
    const newProfile: Admin = { ...profile }

    // Verify password
    if (inputOldPassword || inputNewPassword) {
      if (!inputOldPassword || !inputNewPassword) {
        throw new BadRequestException('Incomplete passwords')
      }
      if (inputOldPassword === inputNewPassword) {
        throw new BadRequestException('Old password and new password cannot be the same')
      }
      if (!(await this.validatePassword(decodeBase64(inputOldPassword)))) {
        throw new BadRequestException('Old password incorrect')
      }
      // Set new password
      const plainNewPassword = decodeBase64(inputNewPassword)
      newProfile.password = await bcrypt.hash(plainNewPassword, APP_BIZ.PASSWORD.bcryptSaltRounds)
    }

    // save
    const existedProfile = await this.adminModel.findOne().select('+password').exec()
    if (existedProfile) {
      await Object.assign(existedProfile, newProfile).save()
    } else {
      await this.adminModel.create(newProfile)
    }

    return this.getProfile()
  }
}
