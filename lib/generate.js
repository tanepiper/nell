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

var loadPlugins = require( path.join(__dirname, 'generate', 'load_plugins') );
var loadItems = require( path.join(__dirname, 'generate', 'load_items') );
var processPlugins = require( path.join(__dirname, 'generate', 'process_plugins') );
var processItems = require( path.join(__dirname, 'generate', 'process_items') );
var outputItems = require( path.join(__dirname, 'generate', 'output_items') );
var outputIndex = require( path.join(__dirname, 'generate', 'output_index') );

module.exports = {
  key: 'generate',
  desc: 'Reads a hyde.json config file and generates a site',
  /**
   * This function allows us to generate the complete site output.
   * It first needs to read all the source data, this way we have all the available
   * post and page data used to generate our page content, and also make available
   * to other sections like sidebars
   */
  run: function(site_path, done) {
    var hyde_site = {
      site_path: site_path
    };

    // First check we have a config file in the base of the project folder
    hyde_site.config_path = path.join(site_path, 'hyde.json');
    if ( !fs.existsSync(hyde_site.config_path) ) {
      done( new Error('Unable to load hyde.json config file') );
      return;
    }
    hyde_site.config = require(hyde_site.config_path);
    // From the above config, get some specific members that we want to be more useful
    hyde_site.site = (hyde_site.config.site) ? hyde_site.config.site : {};
    hyde_site.menu = (hyde_site.config.menu) ? hyde_site.config.menu : {};

    // Manage the output path of the site
    hyde_site.output_path =  (hyde_site.config.output && hyde_site.config.output.path) ? path.join(hyde_site.site_path, hyde_site.config.output.path) : path.join(hyde_site.site_path, 'output');

    // Check if the user wants us to delete the output on generation
    if (hyde_site.config.output && hyde_site.config.output.delete) {
      fs.unlinkSync(hyde_site.output_path);
    }
    //console.log(hyde_site);

    // Load plugins
    async.series([
      function(callback) {
        loadPlugins(hyde_site, callback);
      },
      function(callback) {
        loadItems(hyde_site, 'post', function() {
          processItems(hyde_site, 'post', function() {
            processPlugins(hyde_site, 'post', callback);
          });
        });
      },
      function(callback) {
        loadItems(hyde_site, 'page', function() {
          processItems(hyde_site, 'page', function() {
            processPlugins(hyde_site, 'page', callback);
          });
        });
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
    ], done);
  }
};