const axios = require('axios');
const Promise = require('bluebird');
const fs = require('fs');
const _ = require('lodash');
const path = require('path');

var { 
  adminToken,
  status
 } = require('../settings.json');

var checkGeoCall = function () {
  return new Promise(function (fulf, rej) {
    var settings = require('../geo-api-settings.json');
    var settingsFile = path.join(__dirname, '../geo-api-settings.json');
    var now = new Date().getTime();
    var lastCallAt = settings.geoApiCalledAt;
    var callCount = settings.geoApiCallCount;
    var maxLimit = settings.geoApiMaxLimit;
    var diff = (now - lastCallAt) / 36e5;

    if (diff <= 1 && callCount >= maxLimit) {
      rej(status['REACHED_MAX_API_CALL_LIMIT'])
    }
    else if (diff <= 1 && callCount < maxLimit) {
      settings['geoApiCallCount'] = ++callCount;
    }
    else if (diff > 1) {
      settings['geoApiCalledAt'] = now;
      settings['geoApiCallCount'] = 1;
    }

    settings = JSON.stringify(settings);
    fulf({ settings, settingsFile });
  });
};

var updateApiMaxCall = function (pObj) {
  return new Promise(function (fulf, rej) {
    var settings = require('../geo-api-settings.json');
    var settingsFile = path.join(__dirname, '../geo-api-settings.json');
    var { token, newMaxApiLimit } = pObj;

    if (token !== adminToken) {
      rej(status['INVALID_AUTH'])
    }

    settings['geoApiMaxLimit'] = newMaxApiLimit;
    settings = JSON.stringify(settings)
    fulf({ settings, settingsFile });
  });
};

var updateSettingsFile = function (pObj) {
  return new Promise(function (fulf, rej) {
    var { settings, settingsFile } = pObj;
    fs.writeFile(settingsFile, settings, function (err) {
      if (err) rej(err);

      fulf(pObj);
    });
  });
};

var getGeoData = function (pObj) {
  return new Promise(function (fulf, rej) {
    var { url } = pObj;

    axios(url, { method: 'GET' })
      .then(geoRes => (!_.isEmpty(geoRes.data) && !_.isEmpty(geoRes.data.results) && geoRes.data.results) || '')
      .then(data => {
        if (!data) rej(status['NO_RESULT']);

        fulf(data);
      })
      .catch(err => rej(err));
  });
};

module.exports = {
  checkGeoCall, 
  updateApiMaxCall,
  getGeoData,
  updateSettingsFile
};