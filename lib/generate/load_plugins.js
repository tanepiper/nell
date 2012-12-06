'use strict';

var fs = require('fs');
var path = require('path');
var async = require('async');

module.exports = function(hyde_site, done) {

  hyde_site.plugins = {};
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
            hyde_site.plugins[plugin.replace('.js', '')] = require(path.join(__dirname, '..', 'plugins', plugin));
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
            hyde_site.plugins[plugin.replace('.js', '')] = require(path.join(hyde_site.site_path, 'plugins', plugin));
          });
        }
        callback();
      });
    }
  ], done);
};