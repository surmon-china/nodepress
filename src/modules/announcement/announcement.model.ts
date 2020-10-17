/**
 * Announcement model.
 * @file 公告模块数据模型
 * @module module/announcement/model
 * @author Surmon <https://github.com/surmon-china>
 */

import { Types } from 'mongoose';
import { AutoIncrementID } from '@typegoose/auto-increment';
import { prop, plugin, pre, defaultClasses } from '@typegoose/typegoose';
import { IsString, IsInt, IsIn, IsDefined, IsNotEmpty, IsArray, ArrayNotEmpty, ArrayUnique } from 'class-validator';
import { mongoosePaginate } from '@app/transformers/mongoose.transformer';
import { getProviderByTypegooseClass } from '@app/transformers/model.transformer';
import { EPublishState } from '@app/interfaces/state.interface';

@pre<Announcement>('findOneAndUpdate', function (next) {
  this.findOneAndUpdate({}, { update_at: Date.now() });
  next();
})
@plugin(mongoosePaginate)
@plugin(AutoIncrementID, { field: 'id', startAt: 1 })
export class Announcement extends defaultClasses.Base {
  @prop({ unique: true })
  id: number;

  @IsNotEmpty({ message: '内容？' })
  @IsString({ message: '字符串？' })
  @prop({ required: true, validate: /\S+/ })
  content: string;

  @IsDefined()
  @IsIn([EPublishState.Draft, EPublishState.Published])
  @IsInt({ message: '数字？' })
  @prop({ enum: EPublishState, default: EPublishState.Published, index: true })
  state: EPublishState;

  @prop({ default: Date.now })
  create_at?: Date;

  @prop({ default: Date.now })
  update_at?: Date;
}

export class DelAnnouncements {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  announcement_ids: Types.ObjectId[];
}

export const AnnouncementProvider = getProviderByTypegooseClass(Announcement);
