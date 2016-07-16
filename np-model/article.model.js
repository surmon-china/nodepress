var mongoose = require('mongoose');

// 文章集合模型
var articleSchema = new mongoose.Schema({

  // 文章标题
  title:  String,

  // author: String,
  content: String,

  // 文章描述
  description: String,

  // 文章发布状态 =》 -1已删除，0草稿，1发布
  status: { type: Number, default: 1 },

  // 文章公开状态 = // 0非公开，1公开
  public: { type: Number, default: 1 },

  // 文章密码 =》 加密状态生效
  password: String,

  // 发布日期
  date: { type: Date, default: Date.now },

  // 文章标签
  tags: [{ name: String, slug: String }],

  // 文章分类
  category: [{ name: String, slug: String, description: String }],

  // 评论
  comments: [{ 
    content: String,
    date: Date,
    user: {
      name: { type: String, default: '匿名用户' }, // 发布者名字
      email: String, // 发布者邮箱
      ip: { type: String, default: '未知IP' }, // 发布者IP
      url: String, // 发布者地址
      agent: String, // 发布者UA
      reply: {} // 评论回复
    }
  }],

  // 边栏展示 =》 0不显示，1left，2right
  sidebar: String,
  meta: {
    views: Number,
    favs:  Number
  },

  // 自定义扩展
  extend: {}
});

// 文章模型
var Article = mongoose.model('Article', articleSchema);

// 模块化
module.exports = Article;