/**
 * @file Mongoose infra
 * @module interface/mongoose
 * @author Surmon <https://github.com/surmon-china>
 */

import type { Types, Model, HydratedDocument } from 'mongoose'
import type { PaginateStatics } from '@app/utils/paginate'

// https://mongoosejs.com/docs/api.html#model_Model.findById
// The id is cast based on the Schema before sending the command.
// https://mongoosejs.com/docs/api.html#model_Model.findByIdAndDelete
// id «Object|Number|String» value of _id to query by.
export type MongooseId = Types.ObjectId | string
export type MongooseObjectId = Types.ObjectId

export type WithId<T> = T & { _id: MongooseObjectId }

export type MongooseDoc<T> = HydratedDocument<WithId<T>>
export type MongooseModel<T> = Model<T> & PaginateStatics<WithId<T>, MongooseDoc<T>>
