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
var mde = require('markdown-extra');

var generateOutputDetails = require( path.join(__dirname, 'output_details') );

module.exports = function(hyde_site, type, done) {
  hyde_site[type + 's_path'] = path.join(hyde_site.site_path, 'source', type + 's');
  async.waterfall([
    function(callback) {
      fs.readdir(hyde_site[type + 's_path'], callback);
    }, function(files, callback) {  
      if (files.length > 0) {
        hyde_site[type + 's'] = [];
        var files_date_order = files.reverse();

        files_date_order.forEach(function(file) {
          var item = {};
          item.file_path = path.join(hyde_site[type + 's_path'], file);
          item.file_output = generateOutputDetails(hyde_site, file, type);
          item.link = item.file_output.link_path;
          item.file_content_raw = fs.readFileSync(item.file_path, 'utf8');
          item.file_metadata = mde.metadata(item.file_content_raw);
          item.file_content = mde.content(item.file_content_raw);
          hyde_site[type + 's'].push(item);
        });
        callback();
      }
    }
  ], done);
};