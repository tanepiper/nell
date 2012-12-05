'use strict';

module.exports = function(id, filename) {
  return '<script src="https://gist.github.com/' + id + '.js' + ( (filename) ? '?file=' + filename : '') + '"></script>';
};