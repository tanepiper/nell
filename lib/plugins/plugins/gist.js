'use strict';

var parser = require('swig/lib/parser');
var helpers = require('swig/lib/helpers');

module.exports = (function() {

  var gist = function() {
    var id = parser.parseVariable(this.args[0]);
    var output = [
      '(function() {',
        helpers.setVar('__id', id),
        '_output += \'<script src="https://gist.github.com/\' + __id + \'.js"></script>\';',
      '})();'
    ];
    return output.join('');
  };

  gist.ends = false;

  return gist;
}());