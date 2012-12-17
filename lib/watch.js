/*global __:true*/
/*
 * nell
 * https://github.com/tanepiper/nell
 *
 * Copyright (c) 2012 Tane Piper
 * Licensed under the MIT license.
 * https://github.com/tanepiper/nell/blob/master/LICENSE-MIT
 */
'use strict';

var watchr = require('watchr');
var preview = require('./preview');
var generate = require('./generate');
var path = require('path');

module.exports = {
  key: 'watch',
  args: '[port:4000]',
  default: 4000,
  desc: __('Preview the site and build when any file changes are made'),
  run: function(site_path, arg, cmd, done) {
    watchr.watch({
      paths: [
        path.join(site_path, 'source'),
        path.join(site_path, 'themes')
      ],
      listeners: {
        watching: function(err) {
          if (err) {
            return done(err);
          }
          preview.run(site_path, arg, cmd, done);
        },
        change: function() {
          generate.run(site_path, arg, cmd, done);
        }
      }
    });
  }
};