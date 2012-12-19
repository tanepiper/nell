/*global __:true*/
/*
 * nell
 * https://github.com/tanepiper/nell
 *
 * Copyright (c) 2012 Tane Piper
 * Licensed under the MIT license.
 * https://github.com/tanepiper/nell/blob/master/LICENSE-MIT
 */
'use strict';

var fs = require('fs');
var path = require('path');
var async = require('async');
var _ = require('underscore');

module.exports = function(nell_site, done) {
  // Fallback to default theme if no theme name passed
  //var theme = (nell_site.theme && nell_site.theme.name) ? nell_site.theme.name : 'default';
  var output_file_template = 'index.html';
  //var template_file = path.join(nell_site.site_path, 'themes', theme, 'templates', output_file_template);

  async.series([
    function(callback) {
      // Generate a jade complile function
      var tpl = nell_site.swig.compileFile(output_file_template);
      var items = nell_site.posts.slice(0, nell_site.site.paginate.number_per_page);
      var index_locals = _.extend(nell_site, {posts: items});
      var index_html = tpl.render(index_locals);

      var write_out = fs.createWriteStream(path.join(nell_site.site_path, 'output', 'index.html'), {encoding: 'utf8'});
      write_out.on('close', callback);
      write_out.on('error', callback);
      write_out.write(index_html);
      write_out.end();
    }
  ], done);
};