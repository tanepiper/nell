/*
 * hyde
 * https://github.com/tanepiper/hyde
 *
 * Copyright (c) 2012 Tane Piper
 * Licensed under the MIT license.
 * https://github.com/tanepiper/hyde/blob/master/LICENSE-MIT
 */
'use strict';
var mkdirp = require('mkdirp');
var wrench = require('wrench');
var fs = require('fs');
var async = require('async');
var path = require('path');

var createDirectories = function(site_path, done) {

  async.series([
    function(callback) {
      mkdirp(site_path, '0775', callback);
    }, function(callback) {
      mkdirp(path.join(site_path, 'themes'), '0775', callback);
    }, function(callback) {
      mkdirp(path.join(site_path, 'source'), '0775', callback);
    }, function(callback) {
      mkdirp(path.join(site_path, 'plugins'), '0775', callback);
    }, function(callback) {
      mkdirp(path.join(site_path, 'output'), '0775', callback);
    }
  ], done);
};

var createFiles = function(site_path, done) {
  async.series([
    function(callback) {
      wrench.copyDirRecursive(path.join(__dirname, '..', 'themes', 'default'), path.join(site_path, 'themes', 'default'), callback );
    }, function(callback) {
      wrench.copyDirRecursive(path.join(__dirname, '..', 'source', 'pages'), path.join(site_path, 'source', 'pages'), callback );
    }, function(callback) {
      wrench.copyDirRecursive(path.join(__dirname, '..', 'source', 'posts'), path.join(site_path, 'source', 'posts'), callback );  
    }, function(callback) {
      var hyde_source = fs.createReadStream(path.join(__dirname, '..', 'source', 'hyde.json') );
      var hyde_dest = fs.createWriteStream(path.join(site_path, 'hyde.json'));
      hyde_dest.on('close', callback);
      hyde_dest.on('error', callback);
      hyde_source.pipe(hyde_dest);
    }
  ], done);
};

module.exports = {
  key: 'init',
  args: '[name]',
  desc: 'Generates a new site',
  run: function(site_path, arg, cmd, done) {
    var output_path = path.join(site_path, arg);

    async.series([
      function(callback) {
        fs.exists(output_path, function(exists) {
          if (exists) { return callback( new Error('The directory ' + output_path + ' already exists')); }
          callback();
        });
      },
      function(callback) {
        createDirectories(output_path, callback);
      },
      function(callback) {
        createFiles(output_path, callback);
      }
    ], function(err) {
      if (err) {
        done(err);
        return;
      }
      done(null, 'Site ' + arg + ' created in ' + output_path);
      return;
    });
  }
};