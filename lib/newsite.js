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

var newsite = function(options, callback) {
  var full_path = options.path + '/' + options.title;

  async.series([
    function(cb) {
      fs.exists(full_path, function(exists) {
        if (exists) {
          var err = new Error('The directory ' + full_path + ' already exists');
          cb(err);
          return;
        }
        cb();
      });
    },
    function(cb) {
      mkdirp(full_path, '0775', cb);
    },
    function(cb) {
      wrench.copyDirSyncRecursive(__dirname + '/../themes', full_path + '/themes');
      wrench.copyDirSyncRecursive(__dirname + '/../source', full_path + '/source');

      fs.writeFileSync(full_path + '/hyde.json', JSON.stringify({
        theme: {
          name: 'default',
          index: 'default.jade'
        },
        site: {
          title: 'Example Site',
          url: 'http://example.com'
        },
        menu: [{
          title: 'Home',
          path: '/'
        }, {
          title: 'About',
          path: '/about/'
        }]
      }, null, 2));
      cb();
    }
  ], callback);
};

module.exports = newsite;