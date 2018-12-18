/**
 * Announcement model module.
 * @file 公告数据模型
 * @module model/announcement
 * @author Surmon <https://github.com/surmon-china>
 */

import { NAME } from '../modules/announcement/announcement.constant';
import { EPublishState } from '@app/interfaces/state.interface';
import { plugin, pre, prop, Typegoose, ModelType, InstanceType } from 'typegoose';
import { mongoosePaginate, mongooseAutoIncrement } from '@app/transforms/mongoose.transform';

// 公告模型
// 翻页 + 自增 ID 插件配置
@plugin(mongoosePaginate)
@plugin(mongooseAutoIncrement.plugin, {
  model: NAME,
  field: 'id',
  startAt: 1,
  incrementBy: 1,
})
@pre<AnnouncementSchema>('findOneAndUpdate', function(next) {
  this.findOneAndUpdate({}, { update_at: Date.now() });
  next();
})
export class AnnouncementSchema extends Typegoose {
  @prop({ required: true, validate: /\S+/ })
  content: string;

  @prop({ default: EPublishState.Published })
  state?: number;

  @prop({ default: Date.now })
  create_at?: Date;

  @prop({ default: Date.now })
  update_at?: Date;
}
