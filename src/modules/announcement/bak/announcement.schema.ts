/**
 * Announcement model module.
 * @file 公告数据模型
 * @module model/announcement
 * @author Surmon <https://github.com/surmon-china>
 */

import { Schema, Document } from 'mongoose';
import { NAME } from '../announcement.constants';
import { EPublishState } from '@app/interfaces/state.interface';
import { mongoosePaginate, mongooseAutoIncrement } from '@app/transforms/mongoose.transform';

export interface IAnnouncement extends Document {
  readonly content: string;
  readonly state?: EPublishState;
  readonly create_at?: Date;
  readonly update_at?: Date;
}

// 公告模型
export const AnnouncementSchema = new Schema({

  // 公告内容
  content: { type: String, required: true, validate: /\S+/ },

  // 公告发布状态 => 0 草稿，1 已发布
  state: { type: Number, default: EPublishState.Published },

  // 发布日期
  create_at: { type: Date, default: Date.now },

  // 最后修改日期
  update_at: { type: Date, default: Date.now },
});

// 翻页 + 自增 ID 插件配置
AnnouncementSchema.plugin(mongoosePaginate);
AnnouncementSchema.plugin(mongooseAutoIncrement.plugin, {
  model: NAME,
  field: 'id',
  startAt: 1,
  incrementBy: 1,
});

// 时间更新
AnnouncementSchema.pre('findOneAndUpdate', function(next) {
  this.findOneAndUpdate({}, { update_at: Date.now() });
  next();
});
