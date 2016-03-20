var MongoClient = require('./').MongoClient;

MongoClient.connect('mongodb://localhost:27017/test', function(err, db) {
  console.dir(err)

  var json = require('./test.json');

  db.collection('t').insertOne(json, function(err, r) {
    console.dir(err)
    console.dir(r)
    db.close();

  })
});
