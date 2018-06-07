const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

var { 
  morganOptions, 
  port,
  status 
} = require('./settings.json');
var routes = require('./routers/routes');
var logger = require('./logger/logger');
var logDir = path.join(__dirname, 'log')

var app = express();

// Checking for log directory
// if Dir does not exists then create one
fs.existsSync(logDir) || fs.mkdirSync(logDir)

app.use(bodyParser.json());
app.use(cors());
app.use(morgan(morganOptions, { stream: logger.stream }))

app.use('/api', routes);
app.get('/', (req, res) => res.redirect('/api/server/uptime'));
app.use('/*', (req, res) => res.json(status['INVALID_API']));

port = process.env.PORT || port;
app.listen(port, function (err) {
  if (err) console.log(err);

  console.log('Server started!');
});

module.exports = app;