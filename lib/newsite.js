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

var newsite = function(options, done) {
  var site_path = path.join(options.path, options.title);
  if (fs.existsSync(site_path)) {
    done( new Error('The directory ' + site_path + ' already exists') );
    return;
  }

  createDirectories(site_path, function(err) {
    if (err) {
      done(err);
      return;
    }

    createFiles(site_path, done);
  });
};

module.exports = newsite;