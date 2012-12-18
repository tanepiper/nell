'use strict';

var util = require('util');

exports.gist = function(id, filename) {
  var str = util.format('<script src="https://gist.github.com/%s.js', id);
  if (filename) {
    str += util.format('?file=%s', filename);
  }
  str +='"></script>';
  return str;
};