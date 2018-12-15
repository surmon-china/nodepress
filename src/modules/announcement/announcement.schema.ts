/**
 * Announcement model module.
 * @file 公告数据模型
 * @module model/announcement
 * @author Surmon <https://github.com/surmon-china>
 */

import { EPublishState } from '@app/interfaces/state.interface';
import { mongoose, mongoosePaginate, mongooseAutoIncrement } from '@app/transforms/mongoose.transform';

// 公告模型
const schema = new mongoose.Schema({

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
schema.plugin(mongoosePaginate);
schema.plugin(mongooseAutoIncrement.plugin, {
  model: 'Announcement',
  field: 'id',
  startAt: 1,
  incrementBy: 1,
});

// 时间更新
schema.pre('findOneAndUpdate', function(next) {
  this.findOneAndUpdate({}, { update_at: Date.now() });
  next();
});

// 公告模型
export const AnnouncementSchema = schema;
