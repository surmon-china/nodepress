/**
 * @file User service
 * @module module/user/service
 * @author Surmon <https://github.com/surmon-china>
 */

import type { QueryFilter } from 'mongoose'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { Injectable, NotFoundException } from '@nestjs/common'
import { MongooseModel, MongooseDoc } from '@app/interfaces/mongoose.interface'
import { PaginateOptions, PaginateResult } from '@app/utils/paginate'
import { InjectModel } from '@app/transformers/model.transformer'
import { EventKeys } from '@app/constants/events.constant'
import { isDevEnv } from '@app/app.environment'
import { createLogger } from '@app/utils/logger'
import { CreateUserDto, UpdateUserDto } from './user.dto'
import { User } from './user.model'

const logger = createLogger({ scope: 'UserService', time: isDevEnv })

@Injectable()
export class UserService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    @InjectModel(User) private readonly userModel: MongooseModel<User>
  ) {}

  public paginate(filter: QueryFilter<User>, options: PaginateOptions): Promise<PaginateResult<User>> {
    return this.userModel.paginateRaw(filter, options)
  }

  public async findOne(userId: number): Promise<MongooseDoc<User>> {
    const user = await this.userModel.findOne({ id: userId }).exec()
    if (!user) throw new NotFoundException(`User '${userId}' not found`)
    return user
  }

  public async create(input: CreateUserDto): Promise<MongooseDoc<User>> {
    const created = await this.userModel.create(input)
    this.eventEmitter.emit(EventKeys.UserCreated, created.toObject())
    return created
  }

  public async update(userId: number, input: UpdateUserDto): Promise<MongooseDoc<User>> {
    const updated = await this.userModel
      .findOneAndUpdate({ id: userId }, { $set: input }, { returnDocument: 'after' })
      .exec()
    if (!updated) throw new NotFoundException(`User '${userId}' not found`)
    return updated
  }

  public async delete(userId: number): Promise<MongooseDoc<User>> {
    const deleted = await this.userModel.findOneAndDelete({ id: userId }).exec()
    if (!deleted) throw new NotFoundException(`User '${userId}' not found`)
    this.eventEmitter.emit(EventKeys.UserDeleted, deleted)
    return deleted
  }
}
