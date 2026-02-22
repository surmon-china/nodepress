/**
 * @file User account service
 * @module module/user/me/service.account
 * @author Surmon <https://github.com/surmon-china>
 */

import { Injectable, BadRequestException, ConflictException } from '@nestjs/common'
import { MongooseModel, MongooseDoc } from '@app/interfaces/mongoose.interface'
import { InjectModel } from '@app/transformers/model.transformer'
import { createLogger } from '@app/utils/logger'
import { isDevEnv } from '@app/app.environment'
import { UserType, UserIdentityProvider } from '../user.constant'
import { User, UserIdentity } from '../user.model'
import { UserService } from '../user.service'
import { UpdateProfileDto } from './me.dto'

const logger = createLogger({ scope: 'UserAccountService', time: isDevEnv })

@Injectable()
export class UserAccountService {
  constructor(
    private readonly userService: UserService,
    @InjectModel(User) private readonly userModel: MongooseModel<User>
  ) {}

  private findOneByIdentity(provider: UserIdentityProvider, uid: string) {
    return this.userModel.findOne({ 'identities.provider': provider, 'identities.uid': uid }).exec()
  }

  public async updateUserProfile(userId: number, input: UpdateProfileDto): Promise<MongooseDoc<User>> {
    const user = await this.userService.findOne(userId)
    return await Object.assign(user, {
      name: input.name,
      email: input.email,
      website: input.website,
      avatar: input.avatar_url
    }).save()
  }

  public async upsertUser(input: UserIdentity): Promise<MongooseDoc<User>> {
    // 1. Attempt to find the user by their unique provider-specific identifier (UID)
    const user = await this.findOneByIdentity(input.provider, input.uid)
    // 2. If the user exists, return it directly.
    // NOTE: We don't overwrite local user profile (name, email, etc.) with OAuth data to respect the user's modifications made within our system.
    if (user) return user
    // 3. If no identity match is found, create a new user record.
    // SECURITY: We intentionally ignore existing emails here to avoid "Account Takeover" vulnerabilities. New users are initialized with OAuth data as default values.
    return await this.userService.create({
      type: UserType.Standard,
      name: input.display_name ?? '',
      email: input.email,
      website: input.profile_url,
      avatar_url: input.avatar_url,
      extras: [],
      identities: [
        {
          provider: input.provider,
          uid: input.uid,
          email: input.email,
          username: input.username,
          display_name: input.display_name,
          avatar_url: input.avatar_url,
          profile_url: input.profile_url,
          linked_at: new Date()
        }
      ]
    })
  }

  /** Link a new social identity to an existing user. */
  public async addIdentity(userId: number, identity: UserIdentity) {
    // 1. Safety check: Ensure this third-party account (Provider + UID) is not already linked to any other user in the system.
    const existingUser = await this.findOneByIdentity(identity.provider, identity.uid)
    if (existingUser) {
      if (existingUser.id !== userId) {
        throw new ConflictException('This social account has already been linked to another user.')
      } else {
        return
      }
    }
    // 2. Ensure the provider doesn't already exist in the target account to prevent duplicate providers (e.g., linking two different GitHub accounts).
    const result = await this.userModel.updateOne(
      { id: userId, 'identities.provider': { $ne: identity.provider } },
      { $push: { identities: { ...identity, linked_at: new Date() } } }
    )
    if (result.matchedCount === 0) {
      throw new BadRequestException(`Your account is already linked to a ${identity.provider} identity.`)
    }

    return result
  }

  /** Unlink a social identity from a user. */
  public async removeIdentity(userId: number, provider: UserIdentityProvider) {
    const targetUser = await this.userService.findOne(userId)
    // Security check: Prevent the user from being locked out. A user must have at least one social identity or a password to access their account.
    if (targetUser.identities.length <= 1) {
      throw new BadRequestException('At least one authentication method is required.')
    }
    // Atomically remove the identity matching the specified provider using $pull.
    return await targetUser.updateOne({ $pull: { identities: { provider } } }).exec()
  }
}
