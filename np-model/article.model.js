/*
*
* 文章数据模型
*
*/

var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var mongoosePaginate = require('mongoose-paginate');

// 自增ID初始化
autoIncrement.initialize(mongoose.connection);

// 文章集合模型
var articleSchema = new mongoose.Schema({

  // 文章标题
  title:  { type: String, required: true },

  // author: String,
  // 文章内容
  content: { type: String, required: true },

  // 文章描述
  description: String,

  // 文章关键字（SEO）
  keyword: Array,

  // 文章别名（具有唯一性）
  slug: { type: String, required: true },

  // 文章发布状态 => -1已删除，0草稿，1已发布
  status: { type: Number, default: 1 },

  // 文章公开状态 = // 0非公开，1公开
  public: { type: Number, default: 1 },

  // 文章密码 => 加密状态生效
  password: String,

  // 发布日期
  date: { type: Date, default: Date.now },

  // 文章标签
  tag: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag'}],

  // 文章分类
  category: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }],

  // 边栏展示 => 0不显示，1left，2right
  sidebar: { type: String, default: 2 },
  meta: {
    views: { type: Number, default: 0 },
    favs:  { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
  },

  // 自定义扩展
  extend: {}
});

// 翻页 + 自增ID插件配置
articleSchema.plugin(mongoosePaginate);
articleSchema.plugin(autoIncrement.plugin, {
  model: 'Article',
  field: 'id',
  startAt: 1,
  incrementBy: 1
});

// 自增ID配置
articleSchema.pre('save', next => {
  if (this.isNew) this.create_time = this.update_time = Date.now();
  if (!this.isNew) this.update_time = Date.now();
  next();
});

// 文章模型
var Article = mongoose.model('Article', articleSchema);

// 模块化
module.exports = Article;