const express = require('express');
const path = require('path');
const _ = require('lodash');
const Promise = require('bluebird');

var logger = require('../controllers/logger');
var { 
  getGeoData, 
  checkGeoCall,
  updateSettingsFile,
  updateApiMaxCall 
} = require('../controllers/geo-api');
var { 
  geoApi,
  geoApiKey,
  logMapKeys, 
  adminToken,
  splitChar, 
  status,
  limit,
  order,
  start
} = require('../settings.json');

var Router = express.Router();

Router.get('/server/uptime', function (req, res) {
  var uptime = process.uptime() + ' Sec';
  res.json({ ...status['SUCCESS'], data:  { uptime } });
});

Router.get('/server/logs', function (req, res) {
  var rQuery = req.query;
  var options = {
    from: parseInt(rQuery.from) || (new Date - 24 * 60 * 60 * 1000),
    until: parseInt(rQuery.until) || (new Date),
    limit: rQuery.limit || limit,
    start: rQuery.start || start,
    order: rQuery.order || order,
    fields: ['message']
  };

  logger.query(options)
    .then(data => { res.json({ ...status['SUCCESS'],  data }) })
    .catch(err => {
      console.log(err)
      if (err.status === 'NO_RESULT') {
        return res.json(status['NO_RESULT']);
      }

      res.json(status['FAIL']);
    });
});

Router.get('/geo/:latlng', function (req, res) {
  var latlng = req.params.latlng;
  var url = `${geoApi}json?latlng=${latlng}&key=${geoApiKey}`;

  checkGeoCall()
    .then(updateSettingsFile)
    .then(() => ({ url }))
    .then(getGeoData)
    .then(data => { res.json({ ...status['SUCCESS'], data }) })
    .catch(err => {
      var validErrorStatus = ['NO_RESULT', 'REACHED_MAX_API_CALL_LIMIT'];
      if (validErrorStatus.indexOf(err.status) !== -1) {
        return res.json(err);
      }

      res.json(status['FAIL']);
    });
});

Router.put('/admin/update', function (req, res) {
  var token = req.get('token');
  var { newMaxApiLimit } = req.body;

  if (newMaxApiLimit === 0) {
    return res.json(status['INVALID_MAX_API_CALL']);
  }
  
  if (!token || !newMaxApiLimit) {
    return res.json(status['INVALID_AUTH']);
  }
  
  updateApiMaxCall({ token, newMaxApiLimit })
    .then(updateSettingsFile)
    .then(data => { res.json(status['UPDATED_MAX_API_LIMIT']) })
    .catch(err => {
      if (err.status === 'INVALID_AUTH') {
        return res.json(err);
      }

      res.json(status['FAIL']);
    })
});

module.exports = Router;