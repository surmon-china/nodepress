'use strict'

// import
const http = require('http');
const helmet = require('helmet');
const express = require('express');
const bodyParser = require('body-parser');
const mongoosePaginate = require('mongoose-paginate');
require('app-module-path').addPath(__dirname + '/');

// app modules
const config = require('np-config');
const routes = require('np-routes');
const mongodb = require('np-mongodb');
const redis = require('np-redis');
const app = express();

// data server
mongodb.connect();
redis.connect();

// global options
mongoosePaginate.paginate.options = {
  limit: config.APP.LIMIT
};

// app config
app.set('port', config.APP.PORT);
app.use(helmet());
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// app routes
routes(app);

// Start server
http.createServer(app).listen(app.get('port'), () => {
  console.log(`NodePress Run！port at ${app.get('port')}`)
});
