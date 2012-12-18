'use strict';

var marked = require('marked');
var async = require('async');

marked.setOptions({
  gfm: true,
  pedantic: false,
  sanitize: false
});

module.exports = function(nell_site, item, done) {

  var processLines = function(line, line_done) {
    var splitter_index = line.indexOf(':');
    var key = line.slice(0, splitter_index).trim();
    var value = line.slice(splitter_index + 1).trim().replace(/\"|\'/g, '');

    if (['categories', 'js_includes', 'css_includes'].indexOf(key) !== -1) {
      if (value !== '') {
        item[ key ] = value.split(',').map(function(mitem) { return mitem.trim(); });
      } else {
        item[ key ] = false; 
      }
    } else {
      item[ key ] = value;
    }
    line_done();
  };

  async.series([
    function(callback) {
      async.forEach(item.file_metadata.split('\n'), processLines, callback);
    },
    function(callback) {
      item.content = nell_site.swig.compile(marked(item.file_content))();
      callback();
    }
  ], done);
};