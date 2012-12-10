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

  hyde_site.plugins = {};
  hyde_site.plugins_desc = {};
  async.series([
    function(callback) {
      // First load global plugins
      fs.readdir(path.join(__dirname, '..', 'plugins'), function(err, plugins) {
        if (err) {
          callback(err);
          return;
        }
        if (plugins.length > 0) {
          plugins.forEach(function(plugin) {
            plugin = require(path.join(__dirname, '..', 'plugins', plugin));
            hyde_site.plugins_desc[plugin.key] = plugin;
            hyde_site.plugins[plugin.key] = plugin.run;
          });
        }
        callback();
      });
      // Next we load user plugins, we load this after the globals as we allow the user to overide existing plugins
      // with their own
    }, function(callback) {
      fs.readdir(path.join(hyde_site.site_path, 'plugins'), function(err, plugins) {
        if (err) {
          callback(err);
          return;
        }
        if (plugins.length > 0) {
          plugins.forEach(function(plugin) {
            plugin = require(path.join(__dirname, '..', 'plugins', plugin));
            hyde_site.plugins_desc[plugin.key] = plugin;
            hyde_site.plugins[plugin.key] = plugin.run;
          });
        }
        callback();
      });
    }
  ], done);
};