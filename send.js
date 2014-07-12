'use strict';

var fs = require('fs')

/**
 * Returns path to the save game file
 * @return {string}
 */
function saveGameFilePath() {
  var filename = process.env.GAME_FILE_NAME
  return [__dirname, 'save-game-files', filename].join('/')
}

/**
 * Creates a read stream from the save game file
 * @return {object} read stream
 */
function createSaveGameReadStream() {
  var filepath = saveGameFilePath()
  return fs.createReadStream(filepath)
}

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
  fs.exists(saveGameFilePath(), function (exists) {
    if (!exists) return cb(false)
    fileNewerThanModified(saveGameFilePath(), modified, cb)
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

      createSaveGameReadStream()
        .on('end', function () { process.stdout.write('done\n') })
        .pipe(res)
    }
    else return res.status(304).end()
  })

}
