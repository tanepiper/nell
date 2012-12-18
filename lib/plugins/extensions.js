'use strict';

var i18n = require('i18n');
var path = require('path');

exports.t = function() {
  i18n.configure({
    locales: ['en'],
    directory: path.join(__dirname, '..', 'locales'),
    register: global
  });

  return i18n.__;
};

