var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);

// 页面集合模型
var pageSchema = new mongoose.Schema({

  // 页面名称
  name:  String,

  // 别名
  slug: String,

  // 页面描述
  description: String,

  // 自定义扩展
  extend: [{ name: String, value: String }]

});

//自增ID配置
pageSchema.plugin(autoIncrement.plugin, {
  model: 'Page',
  field: 'id',
  startAt: 1,
  incrementBy: 1
});
pageSchema.pre('save', next => {
  if (this.isNew) this.create_time = this.update_time = Date.now();
  if (!this.isNew) this.update_time = Date.now();
  next();
});

// 页面模型
var Page = mongoose.model('Page', pageSchema);

// 模块化
module.exports = Page;