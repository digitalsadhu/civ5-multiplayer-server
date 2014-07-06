var express    = require('express')
  , env        = require('envoodoo')
  , fs         = require('fs')

env()

var filename = process.env.GAME_FILE_NAME

var app = express()

app.post('/game', function (req, res) {
  var write = fs.createWriteStream([
    __dirname,
    'save-game-files',
    filename
  ].join('/'))

  req.pipe(write)
  req.on('end', function () {
    console.log('[INFO]', 'data receive complete')
    res.send({success: true})
  })

  console.log('[INFO]', 'receiving data...')
})

app.get('/sync/:modified', function (req, res) {
  console.log('[INFO]', 'client requested sync')

  var filepath = [__dirname, 'save-game-files', filename].join('/')

  fs.exists(filepath, function (exists) {

    if (!exists) {
      res.status(304)
      return res.send('')
    }

    var stats = fs.stat(filepath, function (err, stats) {
      if (err) throw err

      var modified = stats.mtime.getTime()

      if (modified > req.params.modified) {
        console.log('[INFO]', 'client out of date, syncing...')
        var readstream = fs.createReadStream(filepath)
        .on('end', function () {
          console.log('[INFO]', 'synced')
        })

        readstream.pipe(res)
      }
      else {
        res.status(304)
        res.send('')
      }
    })
  })
})

app.listen(process.env.PORT)
console.log('CIV 5 Multiplayer server listening on port', process.env.PORT)
