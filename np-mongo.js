// mongoose 数据库
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var mongodb = mongoose.connection;

// 连接数据库
mongoose.connect('mongodb://localhost/NodePress');

// 连接错误
mongodb.on('error', function(error) {
  console.log(error);
});

// 连接成功
mongodb.once('open', function() {
  console.log('mongoose 连接成功!');
});

// 定义一个集合/表
var articleSchema = new Schema({
  title:  String,
  // author: String,
  content: String,
  description: String,
  // 文章发布状态 =》 -1已删除，0草稿，1发布
  status: Number,
  // 文章公开状态 = // 0非公开，1公开
  public: Number,
  // 文章密码 =》 加密状态生效
  password: String,
  // 发布日期
  date: { type: Date, default: Date.now },
  // 文章标签
  tags: [{ name: String, slug: String }],
  // 文章分类
  categorise: [{ name: String, slug: String }],
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

var Article = mongoose.model('article', articleSchema);

var article = new Article({
  title: '测试',
  // author: 'Surmon',
  content: '文章内容'        
});

Article.find(function (err, articles) {
  if (err) return console.error(err);
  console.log(articles)
});

console.log('执行了');
/*
article.save(function (err, _article) {
  if (err) return console.error(err);
  console.log(_article);
});
*/

exports.mongodb = mongodb;