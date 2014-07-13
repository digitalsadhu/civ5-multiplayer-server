'use strict';

var fs     = require('fs')
  , crypto = require('crypto')

/**
 * Asyncronously calculates the sha1 hash of a file
 * @param  {string}   filepath
 * @param  {Function} cb
 */
module.exports = function (filepath, cb) {
  var fd   = fs.createReadStream(filepath)
    , hash = crypto.createHash('sha1')

  hash.setEncoding('hex')

  fd.on('end', function() {
    hash.end();
    cb(null, hash.read())
  })

  fd.on('error', cb)

  fd.pipe(hash);
}
