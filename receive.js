'use strict';

var fs = require('fs')

/**
 * Creates a game file write stream
 * @return {object} write stream object
 */
function createGameFileStream() {
  var filename = process.env.GAME_FILE_NAME
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
  })

  process.stdout.write('[SERVER] receiving data... ')
}
