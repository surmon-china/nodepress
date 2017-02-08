/*
*
* 公告数据模型
*
*/

const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const mongoosePaginate = require('mongoose-paginate');

// 自增ID初始化
autoIncrement.initialize(mongoose.connection);

// 公告模型
const announcementSchema = new mongoose.Schema({

  // 公告内容
  content: { type: String, required: true },

  // 公告发布状态 => 0草稿，1已发布
  state: { type: Number, default: 1 },

  // 发布日期
  create_time: { type: Date, default: Date.now },

  // 最后修改日期
  update_time: { type: Date }
});

// 翻页 + 自增ID插件配置
announcementSchema.plugin(mongoosePaginate);
announcementSchema.plugin(autoIncrement.plugin, {
  model: 'Announcement',
  field: 'id',
  startAt: 1,
  incrementBy: 1
});

// 时间更新
announcementSchema.pre('save', next => {
  if (this.isNew) this.create_time = this.update_time = Date.now();
  if (!this.isNew) this.update_time = Date.now();
  next();
});

// 公告模型
const Announcement = mongoose.model('Announcement', announcementSchema);

// export
module.exports = Announcement;
