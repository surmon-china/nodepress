// 数据库
var mongodb = require('mongodb');

var server = new mongodb.Server('localhost', 27017, { safe: true });
new mongodb.Db('local', server, {}).open(function(error, client){
  if(error) throw error;
  console.log('数据库连接成功');
  var collection = new mongodb.Collection(client, 'config');
  collection.find(function(error, cursor){ 
    console.log(cursor);
  //     cursor.each(function(error,doc){
  //         if(doc){
  //             console.log('name:' + doc.name + ' age:' + doc.age);
  //         }
      // });
  });
});