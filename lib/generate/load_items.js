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
var util = require('util');
var mde = require('markdown-extra');
var concat = require('concat-stream');

var processMarkdown = require('./process_markdown');
var processPlugins = require('./process_plugins');

var generateOutputDetails = require( path.join(__dirname, 'output_details') );

module.exports = function(nell_site, type, done) {

  // Variables for the whole process
  var type_plural = util.format('%ss', type);
  var type_path_key = util.format('%s_path', type_plural);

  nell_site[type_plural] = nell_site[type_plural] || [];
  nell_site[type_path_key] = nell_site[type_path_key] || path.join(nell_site.site_path, 'source', type_plural);

  // Function to process each item
  var processItem = function(file, file_done) {
    var item = {};
    item.file_path = path.join(nell_site[type_path_key], file);
    item.file_output = generateOutputDetails(nell_site, file, type);
    item.link = item.file_output.link_path;

    var processContent = concat(function(err, file_content_raw) {
      if (err) {
        return file_done(err);
      }
      item.file_content_raw = file_content_raw;
      item.file_metadata = mde.metadata(item.file_content_raw);
      item.file_content = mde.content(item.file_content_raw);

      async.series([
        function(callback) {
          processMarkdown(item, callback);
        },
        function(callback) {
          processPlugins(nell_site, item, callback);
        },
        function(callback) {
          nell_site[type_plural].push(item);
          callback();
        }
      ], file_done);
    });

    var fh = fs.createReadStream(item.file_path, {encoding: 'utf8'});
    fh.on('error', file_done);
    fh.pipe(processContent);
  };
  
  async.waterfall([
    function(callback) {
      fs.readdir(nell_site[type_path_key], callback);
    }, function(files, callback) {
      if (files.length === 0) {
        return callback();
      }
      async.forEach(files.reverse(), processItem, callback);
    }
  ], done);
};