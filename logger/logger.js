const winston = require('winston');
const path = require('path');
const Promise = require('bluebird'); 

var { logMapKeys } = require('../settings.json');
var logFile = path.join(__dirname, '../logs/all-logs.log');
var logger = new winston.Logger({
  transports: [
    new winston.transports.File({
      level: 'info',
      filename: logFile,
      handleExceptions: false,
      json: true,
      maxsize: 5242880,
      maxFiles: 5,
      colorize: false
    }),
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: false,
      json: false,
      colorize: true
    })
  ],
  exitOnError: false
});

// module.exports = logger;
module.exports.stream = {
  write: function (message) {
    logger.info(message);
  }
};

module.exports.query = function(options) {
  return new Promise(function (resolve, reject) {
    logger.query(options, function (err, res) {
      if (err) reject(err);

      resolve(res);
    });
  });
}