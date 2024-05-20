/**
 * @file Mongoose & Model & Paginate interface
 * @module interface/mongoose
 * @author Surmon <https://github.com/surmon-china>
 */

import type { Model, Types } from 'mongoose'
import type { DocumentType } from '@typegoose/typegoose'
import type { PaginateModel } from '@app/utils/paginate'

export type MongooseDoc<T> = Omit<DocumentType<T>, '_id' | 'id'> & T & { _id: Types.ObjectId }
export type MongooseModel<T> = Model<MongooseDoc<T>> & PaginateModel<MongooseDoc<T>>

// https://mongoosejs.com/docs/api.html#model_Model.findById
// `The id is cast based on the Schema before sending the command.`
// https://mongoosejs.com/docs/api.html#model_Model.findByIdAndDelete
// `id «Object|Number|String» value of _id to query by.`
export type MongooseId = Types.ObjectId | string
export type MongooseObjectId = Types.ObjectId

export type WithId<T> = T & { _id: Types.ObjectId }
