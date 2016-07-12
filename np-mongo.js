// mongoose 数据库
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var mongodb  = mongoose.createConnection('mongodb://localhost:27017/NodePress');

// console.log(mongodb);

// 连接错误
mongodb.on('error', function(error) {
  console.log(error);
});

// 连接成功
mongodb.once('open', function() {

  console.log('mongoose 连接成功!');

  // console.log(mongodb.collection('article'));

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

  // console.log(articleSchema);

  var Article = mongoose.model('article', articleSchema);

  var article = new Article({
    title: 'this is my blog title',
    author: 'me',
    content: 'the body of my blog. can you see that?'        
  });

  // console.log(Article);
  // console.log(Article.findOne);

  // Article.find({}, function (err, data) {
  //   console.log(data);
  // });

  // console.log(Article);
  // console.log('保存数据');

  var find = function () {
    console.log('执行了');
    Article.find({}).exec(function (err, todos){
      err && console.log('find failed');
      err || console.log('find success');
    });
  };

  find();

  // Article.find(function (err, configs) {
  //   if (err) return console.error(err);
  //   console.log(configs)
  // });

  // Config.findOne({name:"WangEr"}, function(err, doc){
  //   if(err) console.log(err);
  //   else console.log(doc.name + ", password - " + doc.password);
  // });

  // var lisi = new Config({name:"LiSi", password:"123456"});
  // lisi.save(function(err, doc){
  //   if(err)console.log(err);
  //   else console.log(doc.name + ' saved');
  // });
});

exports.mongodb = mongodb;