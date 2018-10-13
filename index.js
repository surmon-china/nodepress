/**
 * Entry module.
 * @file Index 入口文件
 * @module entry
 * @author Surmon <https://github.com/surmon-china>
 */

'use strict'

// modules
const http = require('http')
const helmet = require('helmet')
const express = require('express')
const consola = require('consola')
const bodyParser = require('body-parser')

// global path
require('app-module-path').addPath(__dirname + '/')

// app modules
const CONFIG = require('app.config')
const environment = require('environment')
const redis = require('np-core/np-redis')
const mongodb = require('np-core/np-mongodb')

// data server
redis.connect()
mongodb.connect()

// app routes
const routes = require('np-core/np-routes')
const app = express()

// app config
app.set('port', CONFIG.APP.PORT)
app.use(helmet())
app.use(bodyParser.json({ limit: '1mb' }))
app.use(bodyParser.urlencoded({ extended: true }))

// app routes
routes(app)

// start server
http.createServer(app).listen(app.get('port'), () => {
	consola.ready(`NodePress Run！port at ${app.get('port')}, env: ${environment.environment}`)
})
