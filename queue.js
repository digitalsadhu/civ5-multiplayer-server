'use strict';

var env  = require('envoodoo')
  , mail = require('./mail')()

env()

var queue = process.env.PARTICIPANTS.split(',')
var index = 0

function iterateQueue() {
    index++
    if (index > queue.length - 1)
        index = 0

    console.log('[SERVER]', queue[index], 'is up')

    mail.sendNotificationMail(queue[index])
}

module.exports = function () {
  return {
    iterate: iterateQueue
  }
}
