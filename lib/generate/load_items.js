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
var async = require('async');
var util = require('util');
var mde = require('markdown-extra');
var concat = require('concat-stream');

var generateOutputDetails = require( path.join(__dirname, 'output_details') );

module.exports = function(hyde_site, type, done) {

  // Variables for the whole process
  var type_plural = util.format('%ss', type);
  var type_path_key = util.format('%s_path', type_plural);

  hyde_site[type_plural] = hyde_site[type_plural] || [];
  hyde_site[type_path_key] = hyde_site[type_path_key] || path.join(hyde_site.site_path, 'source', type_plural);

  // Function to process each item
  var processQueue = async.queue(function(file, file_done) {
    var item = {};
    item.file_path = path.join(hyde_site[type_path_key], file);
    item.file_output = generateOutputDetails(hyde_site, file, type);
    item.link = item.file_output.link_path;

    var processContent = concat(function(err, file_content_raw) {
      if (err) {
        return file_done(err);
      }
      item.file_content_raw = file_content_raw;
      item.file_metadata = mde.metadata(item.file_content_raw);
      item.file_content = mde.content(item.file_content_raw);
      hyde_site[type_plural].push(item);
    });

    var fh = fs.createReadStream(item.file_path, {encoding: 'utf8'});
    fh.on('error', file_done);
    fh.on('close', file_done);
    fh.pipe(processContent);
  }, 10);
  
  async.waterfall([
    function(callback) {
      fs.readdir(hyde_site[type_path_key], callback);
    }, function(files, callback) {
      if (files.length === 0) {
        return callback();
      }
      var files_date_order = files.reverse();
      processQueue.push(files_date_order, callback);
    }
  ], done);
};