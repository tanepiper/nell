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
require('longjohn');

var loadPlugins = require( path.join(__dirname, 'generate', 'load_plugins') );
var loadItems = require( path.join(__dirname, 'generate', 'load_items') );
var outputItems = require( path.join(__dirname, 'generate', 'output_items') );
var outputIndex = require( path.join(__dirname, 'generate', 'output_index') );

module.exports = {
  key: 'generate',
  args: null,
  desc: 'Reads a hyde.json config file and generates a site',
  /**
   * This function allows us to generate the complete site output.
   * It first needs to read all the source data, this way we have all the available
   * post and page data used to generate our page content, and also make available
   * to other sections like sidebars
   */
  run: function(site_path, arg, cmd, done) {
    var start = Date.now();
    var hyde_site = {
      site_path: site_path
    };

    async.series([
      function(callback) {
        hyde_site.config_path = path.join(site_path, 'hyde.json');
        fs.exists(hyde_site.config_path, function(exists) {
          if (!exists) {
            return callback(new Error('Unable to load hyde.json config file'));
          }
          callback();
        });
      },
      function(callback) {
        hyde_site.config = require(hyde_site.config_path);
        hyde_site.output_path =  (hyde_site.config.output && hyde_site.config.output.path) ? path.join(hyde_site.site_path, hyde_site.config.output.path) : path.join(hyde_site.site_path, 'output');
        async.forEach(Object.keys(hyde_site.config), function(key, key_done) {
          hyde_site[key] = hyde_site.config[key] || {};
          key_done();
        }, callback);
      },
      function(callback) {
        loadPlugins(hyde_site, callback);
      },
      function(callback) {
        loadItems(hyde_site, 'post', callback);
      },
      function(callback) {
        loadItems(hyde_site, 'page', callback);
      },
      function(callback) {
        if (hyde_site.config.output && hyde_site.config.output.delete) {
          fs.unlink(hyde_site.output_path, callback);
        } else {
          callback();
        }
      },
      function(callback) {
        outputItems(hyde_site, 'post', callback);
      },
      function(callback) {
        outputItems(hyde_site, 'page', callback);
      },
      function(callback) {
        outputIndex(hyde_site, callback);
      }
    ], function(err) {
      var end = Date.now();
      if (err) {
        return done(err);
      }
      done(null, util.format('Site "%s" generated in %ds', hyde_site.site.title, (end - start) / 1000));
    });
  }
};