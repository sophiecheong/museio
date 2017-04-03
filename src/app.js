const express = require('express');
const bodyParser = require("body-parser");
const path = require('path');
const MuseServer = require('./server/MuseServer');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static assets
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, 'public')));

app.use('/api', MuseServer);

// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

const server = app.listen(9000, function () {
    console.log('Server is running..');
});

module.exports = app;