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
var util = require('util');
var async = require('async');
var _ = require('underscore');
var mkdirp = require('mkdirp');

module.exports = function(nell_site, type, done) {
  // Fallback to default theme if no theme name passed
  //var theme = (nell_site.theme && nell_site.theme.name) ? nell_site.theme.name : 'default';
  var output_file_template = util.format('%s.html', type);
  //var template_file = path.join(nell_site.site_path, 'themes', theme, 'templates', output_file_template);
  var type_plural = util.format('%ss', type);
  var tpl;

  var processOutputFile = function(item, item_done) {
    // Generate an object that contains the type and a local copy of the site object for locals
    var item_object = {};
    item_object[type] = item;
    var current_post_locals = _.extend(nell_site, item_object);
    var current_post_html = tpl.render(current_post_locals);

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

  async.series([
    function(callback) {
      tpl = nell_site.swig.compileFile(output_file_template);

      async.forEach(nell_site[type_plural], processOutputFile, callback);
    }
  ], done);
};