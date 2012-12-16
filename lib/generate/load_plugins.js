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

module.exports = function(hyde_site, done) {

  hyde_site.plugins = hyde_site.plugins || {};

  // This is used to display plugins via the `hyde plugins` command
  hyde_site.plugins_desc = {};

  async.waterfall([
    function(callback) {
      // First load global plugins
      fs.readdir(path.join(__dirname, '..', 'plugins'), callback);
    }, function(plugins, callback) {
      if (plugins.length > 0) {
        plugins.forEach(function(plugin) {
          plugin = require(path.join(__dirname, '..', 'plugins', plugin));
          hyde_site.plugins_desc[plugin.key] = plugin;
          hyde_site.plugins[plugin.key] = plugin.run;
        });
      }
      callback();
    }, function(callback) {
      // Next load user plugins, these will overide global plugins if they
      // have the same name
      var user_plugins = path.join(hyde_site.site_path, 'plugins');
      // Check that we have an existing folder, if not then we'll skip with with
      // an empty array
      fs.exists(user_plugins, function(exists) {
        if (!exists) {
          return callback(null, []);
        }
        fs.readdir(user_plugins, callback);
      });
    }, function(plugins, callback) {
      if (plugins.length > 0) {
        plugins.forEach(function(plugin) {
          plugin = require(path.join(__dirname, '..', 'plugins', plugin));
          hyde_site.plugins_desc[plugin.key] = plugin;
          hyde_site.plugins[plugin.key] = plugin.run;
        });
      }
      callback();
    }
  ], done);
};