'use strict';

var marked = require('marked');

marked.setOptions({
  gfm: true,
  pedantic: false,
  sanitize: false
});

module.exports = function(hyde_site, type, done) {
  hyde_site[type + 's'].forEach(function(item) {

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