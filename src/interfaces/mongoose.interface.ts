
import { ModelType } from 'typegoose';
import { PaginateModel, Document } from 'mongoose';

export type TMongooseModel<T> = ModelType<T> & PaginateModel<T & Document>;
