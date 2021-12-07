/**
 * @file Mongoose & Model & Paginate interface
 * @module interface/mongoose
 * @author Surmon <https://github.com/surmon-china>
 */

import { Document } from 'mongoose'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { PaginateModel } from '@app/utils/paginate'

export type MongooseModel<T> = ModelType<T> & PaginateModel<T & Document>
