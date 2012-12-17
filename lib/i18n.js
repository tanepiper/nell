var i18n = require('i18n');
var path = require('path');

i18n.configure({
  locales: ['en'],
  directory: path.join(__dirname, '..', 'locales'),
  register: global
});

module.exports = i18n;