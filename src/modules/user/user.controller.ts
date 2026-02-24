/**
 * @file User controller
 * @module module/user/controller
 * @author Surmon <https://github.com/surmon-china>
 */

import _isUndefined from 'lodash/isUndefined'
import type { QueryFilter } from 'mongoose'
import { Controller, Get, Patch, Post, Delete, Query, Body, Param, ParseIntPipe } from '@nestjs/common'
import { OnlyIdentity, IdentityRole } from '@app/decorators/only-identity.decorator'
import { SuccessResponse } from '@app/decorators/success-response.decorator'
import { PaginateOptions, PaginateResult } from '@app/utils/paginate'
import { CreateUserDto, UpdateUserDto, UserPaginateQueryDto } from './user.dto'
import { UserIdentityProvider } from './user.constant'
import { UserService } from './user.service'
import { User } from './user.model'

@Controller('users')
@OnlyIdentity(IdentityRole.Admin)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @SuccessResponse({ message: 'Get users succeeded', usePaginate: true })
  getUsers(@Query() query: UserPaginateQueryDto): Promise<PaginateResult<User>> {
    const { sort, page, per_page, ...filters } = query
    const queryFilter: QueryFilter<User> = {}
    const paginateOptions: PaginateOptions = { page, perPage: per_page }

    // sort
    if (!_isUndefined(sort)) {
      paginateOptions.dateSort = sort
    }
    // type
    if (!_isUndefined(filters.type)) {
      queryFilter.type = filters.type
    }
    // disabled
    if (!_isUndefined(filters.disabled)) {
      queryFilter.disabled = filters.disabled
    }
    // search
    if (filters.keyword) {
      const keywordRegExp = new RegExp(filters.keyword, 'i')
      queryFilter.$or = [{ name: keywordRegExp }, { email: keywordRegExp }, { website: keywordRegExp }]
    }

    return this.userService.paginate(queryFilter, paginateOptions)
  }

  @Post()
  @SuccessResponse('Create user succeeded')
  createUser(@Body() dto: CreateUserDto): Promise<User> {
    return this.userService.create(dto)
  }

  @Get(':id')
  @SuccessResponse('Get user succeeded')
  getUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.findOne(id)
  }

  @Patch(':id')
  @SuccessResponse('Update user succeeded')
  updateUser(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto): Promise<User> {
    return this.userService.update(id, dto)
  }

  @Delete(':id')
  @SuccessResponse('Delete user succeeded')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id)
  }

  @Delete(':id/identities/:provider')
  @SuccessResponse('Delete user identity succeeded')
  deleteUserIdentity(@Param('id', ParseIntPipe) userId: number, @Param('provider') provider: UserIdentityProvider) {
    return this.userService.pullIdentity(userId, provider)
  }
}
