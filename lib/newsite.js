'use strict';

var mkdirp = require('mkdirp');
var wrench = require('wrench');
var fs = require('fs');
var async = require('async');

var newsite = function(path, name, options, callback) {
  options = options || {};
  var full_path = path + '/' + name;

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
      wrench.copyDirSyncRecursive(__dirname + '/../output', full_path + '/output');

      fs.writeFileSync(full_path + '/hyde.json', JSON.stringify({
        theme: 'default',
        site: {
          title: 'Example Site',
          url: 'http://example.com'
        }
      }, null, 2));
    }
  ], callback);
};

module.exports = newsite;