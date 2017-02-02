/*
*
* 标签数据模型
*
*/

const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const mongoosePaginate = require('mongoose-paginate');

// 自增ID初始化
autoIncrement.initialize(mongoose.connection);

// 标签模型
const tagSchema = new mongoose.Schema({

  // 标签名称
  name:  String,

  // 别名
  slug: String,

  // 标签描述
  description: String,

  // 自定义扩展
  extends: [{ name: String, value: Object }]
});

// 翻页 + 自增ID插件配置
tagSchema.plugin(mongoosePaginate)
tagSchema.plugin(autoIncrement.plugin, {
  model: 'Tag',
  field: 'id',
  startAt: 1,
  incrementBy: 1
});

// 自增ID配置
tagSchema.pre('save', next => {
  if (this.isNew) this.create_time = this.update_time = Date.now();
  if (!this.isNew) this.update_time = Date.now();
  next();
});

// 标签模型
const Tag = mongoose.model('Tag', tagSchema);

// export
module.exports = Tag;
