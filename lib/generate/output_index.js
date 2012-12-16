/*
 * hyde
 * https://github.com/tanepiper/hyde
 *
 * Copyright (c) 2012 Tane Piper
 * Licensed under the MIT license.
 * https://github.com/tanepiper/hyde/blob/master/LICENSE-MIT
 */
'use strict';

var fs = require('fs');
var path = require('path');
var jade = require('jade');
var util = require('util');
var async = require('async');
var _ = require('underscore');

module.exports = function(hyde_site, done) {
  // Fallback to default theme if no theme name passed
  var theme = (hyde_site.theme && hyde_site.theme.name) ? hyde_site.theme.name : 'default';
  var output_file_template = 'index.jade';
  var template_file = path.join(hyde_site.site_path, 'themes', theme, 'templates', output_file_template);

  async.waterfall([
    function(callback) {
      // Check the template file exists
      fs.exists(template_file, function(exists) {
        if (!exists) {
          return done( new Error(util.format('Template file %s does not exist', template_file)));
        }
        // Read the content of the template file
        fs.readFile(template_file, 'utf8', callback);
      });
    },
    function(template_file_content, callback) {
      // Generate a jade complile function
      var compiled_output = jade.compile(template_file_content, {
        filename: template_file,
        pretty: true
      });
      var items = hyde_site.posts.slice(0, hyde_site.site.paginate.number_per_page);
      var index_locals = _.extend(hyde_site, {posts: items});
      var index_html = compiled_output(index_locals);

      var write_out = fs.createWriteStream(path.join(hyde_site.site_path, 'output', 'index.html'), {encoding: 'utf8'});
      write_out.on('close', callback);
      write_out.on('error', callback);
      write_out.write(index_html);
      write_out.end();
    }
  ], done);
};