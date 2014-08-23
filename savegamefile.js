'use strict';

var config = require('config.json')()
  , fs     = require('fs')

/**
 * Returns path to the save game file
 * @return {string}
 */
function saveGameFilePath() {
  var filename = config.SAVE_FILENAME
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

module.exports = function () {
  return {
    path: saveGameFilePath,
    readStream: createSaveGameReadStream
  }
}
