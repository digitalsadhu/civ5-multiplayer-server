'use strict';

var express   = require('express')
  , config    = require('config.json')()
  , send      = require('./send')
  , receive   = require('./receive')
  , hashmatch = require('./hashmatch')

var app = express()

app.post('/game', receive)
app.get('/hashmatch/:filehash', hashmatch)
app.get('/sync/:modified', send)

app.listen(config.PORT)
console.log('CIV 5 Multiplayer server listening on port', config.PORT)
