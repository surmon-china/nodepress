/*
*
* 评论数据模型
*
*/

var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var mongoosePaginate = require('mongoose-paginate');

// 自增ID初始化
autoIncrement.initialize(mongoose.connection);

// 评论集合模型
var commentSchema = new mongoose.Schema({

  // 文章ID
  article_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Article' },

  // 父级评论ID
  pid: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },

  // 发布者用户
  user: {

    // 发布者名字
    name: { type: String, default: '匿名用户' },

    // 发布者邮箱
    email: String,

    // 发布者IP
    ip: { type: String, default: '未知IP' },

    // 发布者地址
    url: String,

    // 发布者UA
    agent: String,

    // 评论回复 => 0待审核，1正常，-1垃圾评论，-2回收站 
    status: String
  },

  // 时间
  date: Date,

  // 内容
  content: String
});

// 翻页 + 自增ID
commentSchema.plugin(mongoosePaginate);
commentSchema.plugin(autoIncrement.plugin, {
  model: 'Comment',
  field: 'id',
  startAt: 1,
  incrementBy: 1
});

// 自增ID配置
commentSchema.pre('save', next => {
  if (this.isNew) this.create_time = this.update_time = Date.now();
  if (!this.isNew) this.update_time = Date.now();
  next();
});

// 评论模型
var Comment = mongoose.model('Comment', commentSchema);

// 模块化
module.exports = Comment;