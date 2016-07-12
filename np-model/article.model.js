
// 文章数据模型
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var articleSchema = new Schema({
    title:  String,
    author: String,
    content: String,
    comments: [{ content: String, date: Date }],
    date: { type: Date, default: Date.now },
    hidden: Boolean,
    sidebar: String,
    meta: {
      views: Number,
      favs:  Number
    }
  });

  // console.log(articleSchema);

// var Article = mongoose.model('article', articleSchema);

// var article = new Article({
//   title: 'this is my blog title',
//   author: 'me',
//   content: 'the body of my blog. can you see that?'        
// });

exports.article = mongoose.model('article', articleSchema);