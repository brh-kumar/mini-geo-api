const _ = require('lodash');
const Promise = require('bluebird');

var logger = require('../logger/logger');
var { logMapKeys, splitChar, status } = require('../settings.json');

function mapLogsToJson(logsList) {
  if (!_.isEmpty(logsList)) {
    logsList = logsList.map(function ({ message }) {
      var obj = {};
      message = message.split(splitChar);
      _.each(logMapKeys, function (key, i) {
        obj[key] = (message[i] && message[i].trim && message[i].trim()) || '';
      })
      return obj;
    });

    return logsList;
  }
}

module.exports = {
  query: function (options) {
    return new Promise (function (fulf, rej) {
      logger.query(options)
        .then(res => {
          var logsList = {};

          if (_.isEmpty(res) || (res && _.isEmpty(res.file))) {
            rej(status['NO_RESULT']);
          }

          logsList = mapLogsToJson(res.file);
          fulf(logsList);
        })
        .catch(err => { rej(err) });
    });
  }
}