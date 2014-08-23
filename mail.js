'use strict';

var nodemailer = require('nodemailer')
  , config     = require('config.json')()
  , fs         = require('fs')
  , handlebars = require('handlebars')
  , errors     = require('./errors')()

var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: config.GMAIL_USERNAME,
    pass: config.GMAIL_PASSWORD
  }
})

var mailOptions = {
   from:    config.GMAIL_USERNAME,
   to:      null,
   subject: config.NOTIFICATION_SUBJECT,
   text:    null
}

var template
fs.readFile(config.NOTIFICATION_TEMPLATE, 'utf8', function (error, data) {
  if (error) return errors.handle(error)
  template = handlebars.compile(data)
})

function sendNotificationMail(player, lastPlayer) {
  mailOptions.to = player.email
  mailOptions.text = template({
    player:     player,
    lastPlayer: lastPlayer,
  })
  transporter.sendMail(mailOptions, function (error, response) {
    if (error) return errors.handle(error)
    console.log('[SERVER] Turn notification mail sent to', player.email)
  })
}

module.exports = function () {
  return {
    sendNotificationMail: sendNotificationMail
  }
}
