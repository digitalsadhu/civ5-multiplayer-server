'use strict';

var filehash     = require('./filehash')
  , saveGameFile = require('./savegamefile')()

/**
 * Express route handler
 * @param  {object} req
 * @param  {object} res
 */
module.exports = function (req, res) {
  filehash(saveGameFile.path(), function (err, hash) {
    if (err) {
      console.log('[SERVER] file hash on server does not match given client hash')
      return res.send({match: false})
    }
    res.send({match: hash === req.params.filehash})
  })
}
