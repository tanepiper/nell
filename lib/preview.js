'use strict';

var express = require('express');

var preview = function(path, port) {
  var server = express();
  server.use(express.static(path));
  if (typeof port !== 'number') {
    port = 4000;
  }
  server.listen(port);
};

module.exports = preview;