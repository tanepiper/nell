'use strict';

var i18n = require('i18n');

exports.t = function() {
  i18n.configure({
    locales: ['en']
  });

  return i18n.__;
};

