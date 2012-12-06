'use strict';

var path = require('path');

module.exports =  function(hyde_site, name, type) {
  var extension;
  var folder;

  if (type === 'post') {
    var year = name.substring(0, 4);
    var month = name.substring(5, 7);
    var day = name.substring(8, 10);

    extension = name.indexOf('.md');
    folder = name.substring(11, extension);

    return {
      output_path: path.join(hyde_site.site_path, 'output', 'posts', year, month, day, folder),
      link_path: path.join('/', 'posts', year, month, day, folder),
      named_path: path.join(hyde_site.site_path, 'output', 'posts', year, month, day, folder, 'index.html')
    };
  } else if (type === 'page') {
    extension = name.indexOf('.md');
    folder = name.substring(0, extension);

    return {
      output_path: path.join(hyde_site.site_path, 'output', folder),
      link_path: path.join('/', folder),
      named_path: path.join(hyde_site.site_path, 'output', folder, 'index.html')
    };
  }
};