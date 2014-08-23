'use strict';

var chalk      = require('chalk')

function handleError(error) {
  console.error(chalk.red('[SERVER]', error))
  console.trace()
}

module.exports = function () {
  return {
    handle: handleError
  }
}
