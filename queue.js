'use strict';

var config = require('config.json')()
  , mail   = require('./mail')()


var players = config.PLAYERS
var index = 0

function iterateQueue() {
    var prevPlayer = players[index]

    index++
    if (index > players.length - 1)
        index = 0

    console.log('[SERVER]', players[index].name, 'is up')

    mail.sendNotificationMail(players[index], prevPlayer)
}

module.exports = function () {
  return {
    iterate: iterateQueue
  }
}
