'use strict';

var parser = require('swig/lib/parser');
var helpers = require('swig/lib/helpers');

module.exports = (function() {

  var youtube = function() {
    var id = parser.parseVariable(this.args[0]);
    //var width = (this.args[1]) ? parser.parseVariable(this.args[1]) : 560;
    //var height = (this.args[2]) ? parser.parseVariable(this.args[2]) : 315;

    var output = [
      '(function() {',
        helpers.setVar('__id', id),
        //helpers.setVar('__width', width),
        //helpers.setVar('__height', height),
        '_output += \'<iframe width="560" height="315" \';',
        '_output += \'src="http://www.youtube.com/embed/\' + __id + \'?rel=0" \';',
        '_output += \'frameborder="0" allowfullscreen></iframe>\';',
      '})();'
    ];
    return output.join('');
  };

  youtube.ends = false;

  return youtube;

}());