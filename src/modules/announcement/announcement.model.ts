/**
 * Announcement model.
 * @file 公告模块数据模型
 * @module module/announcement/model
 * @author Surmon <https://github.com/surmon-china>
 */

import { Types } from 'mongoose';
import { prop, plugin, pre, Typegoose } from 'typegoose';
import { IsString, IsInt, IsIn, IsDefined, IsNotEmpty, IsArray, ArrayNotEmpty, ArrayUnique } from 'class-validator';
import { mongoosePaginate, mongooseAutoIncrement } from '@app/transforms/mongoose.transform';
import { getModelBySchema, getProviderByModel } from '@app/transforms/model.transform';
import { EPublishState } from '@app/interfaces/state.interface';

@pre<Announcement>('findOneAndUpdate', function(next) {
  this.findOneAndUpdate({}, { update_at: Date.now() });
  next();
})

@plugin(mongoosePaginate)
@plugin(mongooseAutoIncrement.plugin, {
  model: Announcement.name,
  field: 'id',
  startAt: 1,
  incrementBy: 1,
})

export class Announcement extends Typegoose {

  @IsNotEmpty({ message: '内容？' })
  @IsString({ message: '字符串？' })
  @prop({ required: true, validate: /\S+/ })
  content: string;

  @IsDefined()
  @IsIn([EPublishState.Draft, EPublishState.Published])
  @IsInt({ message: '数字？' })
  @prop({ default: EPublishState.Published })
  state: EPublishState;

  @prop({ default: Date.now })
  create_at?: Date;

  @prop({ default: Date.now })
  update_at?: Date;
}

export class DelAnnouncements extends Typegoose {

  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  announcement_ids: Types.ObjectId[];
}
export const AnnouncementModel = getModelBySchema(Announcement);
export const AnnouncementProvider = getProviderByModel(AnnouncementModel);
