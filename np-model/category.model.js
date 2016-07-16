var mongoose = require('mongoose');

// 分类集合模型
var categorySchema = new mongoose.Schema({

  // 分类名称
  name:  String,

  // 别名
  slug: String,

  // 分类描述
  description: String,

  // 子分类
  children: [{ name: String, slug: String, description: String }],

  // 自定义扩展
  extend: [{ name: String, value: String }]

});

// 分类模型
var Category = mongoose.model('Category', categorySchema);

// 模块化
module.exports = Category;