'use strict';

var fs           = require('fs')
  , saveGameFile = require('./savegamefile')()

/**
 * Asyncronously checks if a file is newer than a given modified unix timestamp
 * @param  {string}   filepath  - path to file in question
 * @param  {number}   modified  - unix timestamp
 * @param  {Function} cb        - receives true or false
 */
function fileNewerThanModified(filepath, modified, cb) {
  fs.stat(filepath, function (err, stats) {
    if (err) return cb(false)
    if (modified < stats.mtime.getTime()) return cb(true)
    return cb(false)
  })
}

/**
 * Asyncronously determines if file response should be given to the client
 * ie. if the modified timestamp given is older than the last modified of the
 * save game file then should send a new file
 * @param  {number}   modified - unix timestamp
 * @param  {Function} cb       - receives true or false
 */
function shouldSendFile(modified, cb) {
  fs.exists(saveGameFile.path(), function (exists) {
    if (!exists) return cb(false)
    fileNewerThanModified(saveGameFile.path(), modified, cb)
  })
}

/**
 * Express route callback function
 * @param  {object} req
 * @param  {object} res
 */
module.exports = function (req, res) {
  shouldSendFile(req.params.modified, function (shouldSendFile) {
    if (shouldSendFile) {
      process.stdout.write('[SERVER] client out of date, syncing... ')

      saveGameFile.readStream()
        .on('end', function () { process.stdout.write('done\n') })
        .pipe(res)
    }
    else return res.status(304).end()
  })

}
