/**
 * @file User service
 * @module module/user/service
 * @author Surmon <https://github.com/surmon-china>
 */

import type { QueryFilter } from 'mongoose'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { Injectable, NotFoundException } from '@nestjs/common'
import { MongooseModel, WithId } from '@app/interfaces/mongoose.interface'
import { PaginateOptions, PaginateResult } from '@app/utils/paginate'
import { InjectModel } from '@app/transformers/model.transformer'
import { EventKeys } from '@app/constants/events.constant'
import { isDevEnv } from '@app/app.environment'
import { createLogger } from '@app/utils/logger'
import { CreateUserDto, UpdateUserDto } from './user.dto'
import { UserIdentityProvider } from './user.constant'
import { User, UserIdentity } from './user.model'

const logger = createLogger({ scope: 'UserService', time: isDevEnv })

@Injectable()
export class UserService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    @InjectModel(User) private readonly userModel: MongooseModel<User>
  ) {}

  public async findOne(userId: number): Promise<WithId<User>> {
    const user = await this.userModel.findOne({ id: userId }).lean().exec()
    if (!user) throw new NotFoundException(`User '${userId}' not found`)
    return user
  }

  public findOneByIdentity(provider: UserIdentityProvider, uid: string): Promise<WithId<User> | null> {
    return this.userModel.findOne({ 'identities.provider': provider, 'identities.uid': uid }).lean().exec()
  }

  public async pushIdentity(userId: number, identity: UserIdentity) {
    return this.userModel
      .updateOne(
        { id: userId, 'identities.provider': { $ne: identity.provider } },
        { $push: { identities: { ...identity, linked_at: new Date() } } }
      )
      .lean()
      .exec()
  }

  public async pullIdentity(userId: number, provider: UserIdentityProvider) {
    return this.userModel
      .updateOne({ id: userId }, { $pull: { identities: { provider } } })
      .lean()
      .exec()
  }

  public paginate(filter: QueryFilter<User>, options: PaginateOptions): Promise<PaginateResult<WithId<User>>> {
    return this.userModel.paginateRaw(filter, options)
  }

  public async create(input: CreateUserDto): Promise<WithId<User>> {
    const created = (await this.userModel.create(input)).toObject()
    this.eventEmitter.emit(EventKeys.UserCreated, created)
    return created
  }

  public async update(userId: number, input: UpdateUserDto): Promise<WithId<User>> {
    const updated = await this.userModel
      .findOneAndUpdate({ id: userId }, { $set: input }, { returnDocument: 'after' })
      .lean()
      .exec()
    if (!updated) throw new NotFoundException(`User '${userId}' not found`)
    return updated
  }

  public async delete(userId: number): Promise<WithId<User>> {
    const deleted = await this.userModel.findOneAndDelete({ id: userId }).lean().exec()
    if (!deleted) throw new NotFoundException(`User '${userId}' not found`)
    this.eventEmitter.emit(EventKeys.UserDeleted, deleted)
    return deleted
  }
}
