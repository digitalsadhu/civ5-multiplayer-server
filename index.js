'use strict';

var express    = require('express')
  , env        = require('envoodoo')
  , send       = require('./send')
  , receive    = require('./receive')
  , hashmatch  = require('./hashmatch')

env()

var app = express()

app.post('/game', receive)
app.get('/hashmatch/:filehash', hashmatch)
app.get('/sync/:modified', send)

app.listen(process.env.PORT)
console.log('CIV 5 Multiplayer server listening on port', process.env.PORT)
