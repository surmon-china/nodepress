/**
 * @file User me service
 * @module module/user/me/service
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
import { UpsertUserInput } from './me.interface'
import { UpdateProfileDto } from './me.dto'

const logger = createLogger({ scope: 'UserMeService', time: isDevEnv })

@Injectable()
export class UserMeService {
  constructor(
    private readonly userService: UserService,
    @InjectModel(User) private readonly userModel: MongooseModel<User>
  ) {}

  public async upsertUser(input: UpsertUserInput): Promise<MongooseDoc<User>> {
    // 1. Attempt to find the user by their unique provider-specific identifier (UID)
    const user = await this.findOneByIdentity({ provider: input.provider, uid: input.uid })
    // 2. If the user exists, return it directly.
    // NOTE: We don't overwrite local user profile (name, email, etc.) with OAuth data to respect the user's modifications made within our system.
    if (user) return user
    // 3. If no identity match is found, create a new user record.
    // SECURITY: We intentionally ignore existing emails here to avoid "Account Takeover" vulnerabilities. New users are initialized with OAuth data as default values.
    return await this.userService.create({
      type: UserType.Standard,
      name: input.name,
      email: input.email,
      website: input.website,
      avatar: input.avatar,
      identities: [{ provider: input.provider, uid: input.uid, linked_at: new Date() }],
      extras: input.extras ?? []
    })
  }

  public async updateUser(userId: number, input: UpdateProfileDto): Promise<MongooseDoc<User>> {
    const user = await this.userService.findOne(userId)
    return await Object.assign(user, {
      name: input.name,
      email: input.email,
      website: input.website,
      avatar: input.avatar
    }).save()
  }

  private findOneByIdentity(identity: UserIdentity) {
    return this.userModel
      .findOne({ 'identities.provider': identity.provider, 'identities.uid': identity.uid })
      .exec()
  }

  /** Link a new social identity to an existing user. */
  public async addIdentity(userId: number, identity: UserIdentity) {
    const targetUser = await this.userService.findOne(userId)
    // 1. Safety check: Ensure this third-party account (Provider + UID) is not already linked to any other user in the system.
    const existingUser = await this.findOneByIdentity(identity)
    if (existingUser) {
      if (existingUser.id !== userId) {
        throw new ConflictException('This social account has already been linked to another user.')
      } else {
        return
      }
    }
    // 2. Ensure the provider doesn't already exist in the target account to prevent duplicate providers (e.g., linking two different GitHub accounts).
    const hasExistingProvider = targetUser.identities.some((item) => item.provider === identity.provider)
    if (hasExistingProvider) {
      throw new BadRequestException(`Your account is already linked to a ${identity.provider} identity.`)
    }
    // 3. Use $addToSet as an atomic operation to add the identity to the array. This provides a secondary layer of protection against duplicate entries.
    return await targetUser.updateOne({ $addToSet: { identities: { ...identity, linked_at: new Date() } } }).exec()
  }

  /** Unlink a social identity from a user. */
  public async removeIdentity(userId: number, provider: UserIdentityProvider) {
    const targetUser = await this.userService.findOne(userId)
    // Security check: Prevent the user from being locked out. A user must have at least one social identity or a password to access their account.
    if (targetUser.identities.length <= 1) {
      throw new BadRequestException('At least one authentication method is required.')
    }
    // Atomically remove the identity matching the specified provider using $pull.
    return await targetUser.updateOne({ $pull: { identities: { provider: provider } } }).exec()
  }
}
