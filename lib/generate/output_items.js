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
var jade = require('jade');
var util = require('util');
var async = require('async');
var _ = require('underscore');
var mkdirp = require('mkdirp');

module.exports = function(nell_site, type, done) {
  // Fallback to default theme if no theme name passed
  var theme = (nell_site.theme && nell_site.theme.name) ? nell_site.theme.name : 'default';
  var output_file_template = util.format('%s.jade', type);
  var template_file = path.join(nell_site.site_path, 'themes', theme, 'templates', output_file_template);
  var type_plural = util.format('%ss', type);
  var compiled_output;

  var processOutputFile = function(item, item_done) {
    // Generate an object that contains the type and a local copy of the site object for locals
    var item_object = {};
    item_object[type] = item;
    var current_post_locals = _.extend(nell_site, item_object);
    var current_post_html = compiled_output(current_post_locals);

    mkdirp(item.file_output.output_path, function(err) {
      if (err) {
        return item_done(err);
      }
      var write_out = fs.createWriteStream(item.file_output.named_path, {encoding: 'utf8'});
      write_out.on('error', item_done);
      write_out.on('close', item_done);
      write_out.write(current_post_html);
      write_out.end();
    });
  };

  async.waterfall([
    function(callback) {
      fs.exists(template_file, function(exists) {
        if (!exists) {
          return callback( new Error(util.format('Template file %s does not exist', template_file)));
        }
        fs.readFile(template_file, 'utf8', callback);
      });
    },
    function(template_file_content, callback) {
      compiled_output = jade.compile(template_file_content, {
        filename: template_file,
        pretty: true
      });

      async.forEach(nell_site[type_plural], processOutputFile, callback);
    }
  ], done);
};