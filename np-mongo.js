// mongoose 数据库
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
mongoose.connect("mongodb://localhost/NodePress");
var mongodb = mongoose.connection;

// console.log(mongodb);

// 连接错误
mongodb.on('error', function(error) {
  console.log(error);
});

// 连接成功
mongodb.once('open', function() {

  console.log('mongoose 连接成功!');

  // 定义一个集合/表
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

  var Article = mongoose.model('article', articleSchema);

  var article = new Article({
    title: 'this is my blog title',
    author: 'me',
    content: 'the body of my blog. can you see that?'        
  });

  Article.find(function (err, configs) {
    if (err) return console.error(err);
    console.log(configs)
  });

  console.log('执行了');
  article.save(function (err, doc) {
    // if (err) // ...
    console.log('meow');
    console.log(doc);
  });

  Article.find(function (err, configs) {
    if (err) return console.error(err);
    console.log(configs)
  });

});

exports.mongodb = mongodb;