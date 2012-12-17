/*
 * nell
 * https://github.com/tanepiper/nell
 *
 * Copyright (c) 2012 Tane Piper
 * Licensed under the MIT license.
 * https://github.com/tanepiper/nell/blob/master/LICENSE-MIT
 */
'use strict';
var mkdirp = require('mkdirp');
var wrench = require('wrench');
var fs = require('fs');
var async = require('async');
var path = require('path');
var util = require('util');

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
      var nell_source = fs.createReadStream(path.join(__dirname, '..', 'source', 'nell.json') );
      var nell_dest = fs.createWriteStream(path.join(site_path, 'nell.json'));
      nell_dest.on('close', callback);
      nell_dest.on('error', callback);
      nell_source.pipe(nell_dest);
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
          if (exists) {
            return callback(new Error(util.format('The directory %s already exists', output_path)));
          }
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
        return done(err);
      }

      done(null, util.format('Site %s created in %s', arg, output_path));
      return;
    });
  }
};