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
var _ = require('underscore');
var mkdirp = require('mkdirp');

module.exports = function(hyde_site, type, done) {

  // Fallback to default theme if no theme name passed
  var theme = (hyde_site.theme && hyde_site.theme.name) ? hyde_site.theme.name : 'default';
  var output_file_template = type + '.jade';
  var template_file = path.join(hyde_site.site_path, 'themes', theme, 'templates', output_file_template);

  // Check the template file exists
  fs.exists(template_file, function(exists) {
    if (!exists) {
      done( new Error('Template file ' + template_file + ' does not exist'));
      return;
    }
    // Read the content of the template file
    fs.readFile(template_file, 'utf8', function(err, template_file_content) {
      if (err) {
        done(err);
        return;
      }

      // Generate a jade complile function
      var compiled_output = jade.compile(template_file_content, {
        filename: template_file,
        pretty: true
      });

      // Loop over the items of each type
      hyde_site[type + 's'].forEach(function(item) {

        // Generate an object that contains the type and a local copy of the site object for locals
        var item_object = {};
        item_object[type] = item;
        var current_post_locals = _.extend(hyde_site, item_object);

        // Generate the output
        var current_post_html = compiled_output(current_post_locals);
        mkdirp(item.file_output.output_path, function(err) {
          if (err) {
            done(err);
            return;
          }
          var write_out = fs.createWriteStream(item.file_output.named_path, {encoding: 'utf8'});
          write_out.on('error', done);
          write_out.write(current_post_html);
          write_out.end();
        });
      });
      done();
    });
  });
};