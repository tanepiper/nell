/*
 * hyde
 * https://github.com/tanepiper/hyde
 *
 * Copyright (c) 2012 Tane Piper
 * Licensed under the MIT license.
 * https://github.com/tanepiper/hyde/blob/master/LICENSE-MIT
 */
'use strict';

var marked = require('marked');
var util = require('util');

marked.setOptions({
  gfm: true,
  pedantic: false,
  sanitize: false
});

module.exports = function(hyde_site, type, done) {
  var type_plural = util.format('%ss', type);
  
  hyde_site[type_plural].forEach(function(item) {

    item.file_metadata.split('\n').forEach(function(meta_line) {
      var meta_key_value = meta_line.split(/^([A-Za-z_]*)(?::\s?)/ig);

      if (['categories', 'js_includes', 'css_includes'].indexOf(meta_key_value[1]) !== -1) {
         if (meta_key_value[2].trim() !== '') {
            item[ meta_key_value[1] ] = meta_key_value[2].trim().split(',').map(function(mitem) { return mitem.trim(); });
          } else {
            item[ meta_key_value[1] ] = false; 
          }
      } else {
        item[ meta_key_value[1] ] = meta_key_value[2].trim();
      }
    });

    item.content = marked(item.file_content);
  });
  done();
};