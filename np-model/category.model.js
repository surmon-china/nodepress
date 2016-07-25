var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var mongoosePaginate = require('mongoose-paginate');
autoIncrement.initialize(mongoose.connection);

// 分类集合模型
var categorySchema = new mongoose.Schema({

  // 分类名称
  name: { type: String, required: true },

  // 别名
  slug: { type: String, required: true },

  // 分类描述
  description: String,

  // 父分类ID
  pid: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },

  // 创建时间
  created_at: { type: Date, default: Date.now },

  // 自定义扩展
  extend: [{ name: String, value: String }]

});

// 翻页 + 自增ID
categorySchema.plugin(mongoosePaginate);
categorySchema.plugin(autoIncrement.plugin, {
  model: 'Category',
  field: 'id',
  startAt: 1,
  incrementBy: 1
});
categorySchema.pre('save', next => {
  if (this.isNew) this.create_time = this.update_time = Date.now();
  if (!this.isNew) this.update_time = Date.now();
  next();
});

// 分类模型
var Category = mongoose.model('Category', categorySchema);

// 模块化
module.exports = Category;