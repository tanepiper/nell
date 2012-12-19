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
var swig = require('swig');

function extend(destination, source) {
  for (var k in source) {
    if (source.hasOwnProperty(k)) {
      destination[k] = source[k];
    }
  }
  return destination; 
}

module.exports = function(nell_site, done) {

  async.waterfall([
    function(callback) {
      var swig_files_path = path.join(__dirname, '..', 'plugins');
      var extensions = require( path.join(swig_files_path, 'extensions') );
      var filters = require( path.join(swig_files_path, 'filters') );
      var tags = require( path.join(swig_files_path, 'tags') );
      callback(null, extensions, filters, tags);
    }, function(extensions, filters, tags, callback) {
    
      var user_swig_path = path.join(nell_site.site_path, 'plugins');

      if (fs.existsSync(path.join(user_swig_path, 'extensions'))) {
        extend(extensions, require(path.join(user_swig_path, 'extensions')));
      }
      if (fs.existsSync(path.join(user_swig_path, 'filters'))) {
        extend(extensions, require(path.join(user_swig_path, 'filters')));
      }
      if (fs.existsSync(path.join(user_swig_path, 'tags'))) {
        extend(extensions, require(path.join(user_swig_path, 'tags')));
      }
      callback(null, extensions, filters, tags);
    }, function(extensions, filters, tags, callback) {
      var theme = (nell_site.theme && nell_site.theme.name) ? nell_site.theme.name : 'default';

      swig.init({
        allowErrors: false,
        autoescape: false,
        cache: false,
        encoding: 'utf8',
        filters: filters,
        root: path.join(nell_site.site_path, 'themes', theme, 'templates'),
        tags: tags,
        extensions: extensions,
        tzOffset: 0
      });
      nell_site.swig = swig;
      callback();
    }
  ], done);
};