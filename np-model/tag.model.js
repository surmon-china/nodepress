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

  // 发布日期
  create_time: { type: Date, default: Date.now },

  // 最后修改日期
  update_time: { type: Date },

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

// 时间更新
tagSchema.pre('findOneAndUpdate', function(next) {
  this.findOneAndUpdate({}, { update_time: Date.now() });
  next();
});

// 标签模型
const Tag = mongoose.model('Tag', tagSchema);

// export
module.exports = Tag;
