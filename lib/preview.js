'use strict';

var express = require('express');

var preview = function(options, cb) {
  var server = express();
  server.use(express.static(options.path));
  server.listen(options.port);
  cb();
};

module.exports = preview;