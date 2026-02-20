/**
 * @file Mongoose infra
 * @module interface/mongoose
 * @author Surmon <https://github.com/surmon-china>
 */

import type { Types, Model, HydratedDocument } from 'mongoose'
import type { PaginateStatics } from '@app/utils/paginate'

export type MongooseId = Types.ObjectId
export type WithId<T> = T & { _id: MongooseId }

export type MongooseDoc<T> = HydratedDocument<WithId<T>>
export type MongooseModel<T> = Model<T> & PaginateStatics<WithId<T>, MongooseDoc<T>>
