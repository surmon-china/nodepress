/**
 * @file Admin profile service
 * @module module/admin/service.profile
 */

import bcrypt from 'bcryptjs'
import { Injectable, OnModuleInit, BadRequestException } from '@nestjs/common'
import { InjectModel } from '@app/transformers/model.transformer'
import { MongooseModel, MongooseDoc } from '@app/interfaces/mongoose.interface'
import { CacheService, CacheManualResult } from '@app/core/cache/cache.service'
import { GlobalCacheKey } from '@app/constants/cache.constant'
import { decodeBase64 } from '@app/transformers/codec.transformer'
import { Admin, AdminProfile, DEFAULT_ADMIN_PROFILE, ADMIN_SINGLETON_QUERY } from './admin.model'
import { UpdateProfileDto } from './admin.dto'
import { APP_AUTH } from '@app/app.config'

@Injectable()
export class AdminProfileService implements OnModuleInit {
  private cache: CacheManualResult<AdminProfile>

  constructor(
    private readonly cacheService: CacheService,
    @InjectModel(Admin) private readonly adminModel: MongooseModel<Admin>
  ) {
    this.cache = this.cacheService.manual({
      key: GlobalCacheKey.PublicAdminProfile,
      promise: () => this.getRaw()
    })
  }

  onModuleInit() {
    this.cache.update()
  }

  public getCache(): Promise<AdminProfile> {
    return this.cache.get()
  }

  public async getRaw(): Promise<AdminProfile> {
    const adminProfile = await this.adminModel.findOne(ADMIN_SINGLETON_QUERY).select('-_id').lean().exec()
    return adminProfile ?? DEFAULT_ADMIN_PROFILE
  }

  public getDocument(): Promise<MongooseDoc<Admin> | null> {
    return this.adminModel.findOne(ADMIN_SINGLETON_QUERY).select('+password').exec()
  }

  public async validatePassword(plainPassword: string, hashedPassword?: string): Promise<boolean> {
    return hashedPassword
      ? // Hashed password exists in database → validate using bcrypt
        await bcrypt.compare(plainPassword, hashedPassword)
      : // No password in database → compare directly with default password (no hashing)
        plainPassword === APP_AUTH.adminDefaultPassword
  }

  public async update(input: UpdateProfileDto): Promise<AdminProfile> {
    const { password: inputOldPassword, new_password: inputNewPassword, ...profile } = input
    const newProfile: Partial<Admin> = { ...profile }

    // Enforce password change during the initial profile update.
    const existedAdmin = await this.getDocument()
    if (!existedAdmin && !inputNewPassword) {
      throw new BadRequestException('First initialization must set password')
    }

    // Verify password
    if (inputOldPassword || inputNewPassword) {
      if (!inputOldPassword || !inputNewPassword) {
        throw new BadRequestException('Incomplete passwords')
      }
      if (inputOldPassword === inputNewPassword) {
        throw new BadRequestException('Old password and new password cannot be the same')
      }
      if (!(await this.validatePassword(decodeBase64(inputOldPassword), existedAdmin?.password))) {
        throw new BadRequestException('Old password incorrect')
      }

      // Set new password
      const plainNewPassword = decodeBase64(inputNewPassword)
      newProfile.password = await bcrypt.hash(plainNewPassword, APP_AUTH.adminBcryptSaltRounds)
    }

    // Save or create
    if (existedAdmin) {
      await existedAdmin.set(newProfile).save()
    } else {
      await this.adminModel.create(newProfile)
    }

    // Update cache and return
    return await this.cache.update()
  }
}
