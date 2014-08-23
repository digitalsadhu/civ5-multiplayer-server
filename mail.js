'use strict';

var nodemailer = require('nodemailer')
  , env        = require('envoodoo')
  , fs         = require('fs')
  , errors     = require('./errors')()

env()

var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAIL_USERNAME,
    pass: process.env.GMAIL_PASSWORD
  }
})

var mailOptions = {
   from:    process.env.GMAIL_USERNAME,
   to:      null,
   subject: process.env.MAIL_SUBJECT,
   text:    null
}

fs.readFile(process.env.MAIL_TEXT_FILENAME, 'utf8', function (error, data) {
  if (error) return errors.handle(error)
  mailOptions.text = data
})

function sendNotificationMail(to) {
  mailOptions.to = to
  transporter.sendMail(mailOptions, function (error, response) {
    if (error) return errors.handle(error)
    console.log('[SERVER] Turn notification mail sent to', to)
  })
}

module.exports = function () {
  return {
    sendNotificationMail: sendNotificationMail
  }
}
