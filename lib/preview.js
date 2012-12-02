var express = require('express');

var preview = function(path) {
  var server = express();
  server.use(express.static(path));
  server.listen(4000);
};

module.exports = preview;