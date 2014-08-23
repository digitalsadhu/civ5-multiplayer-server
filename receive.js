'use strict';

var config = require('config.json')()
  , fs     = require('fs')
  , queue  = require('./queue')()

/**
 * Creates a game file write stream
 * @return {object} write stream object
 */
function createGameFileStream() {
  var filename = config.SAVE_FILENAME
    , filepath = [__dirname, 'save-game-files', filename].join('/')

  return fs.createWriteStream(filepath)
}

/**
 * Express route callback
 * @param  {object} req
 * @param  {object} res
 */
module.exports = function (req, res) {

  req.pipe(createGameFileStream())

  req.on('end', function () {
    process.stdout.write('done\n')
    res.end()
    queue.iterate()
  })

  process.stdout.write('[SERVER] receiving data... ')
}
