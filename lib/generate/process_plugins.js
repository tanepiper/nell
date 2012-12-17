/*
 * nell
 * https://github.com/tanepiper/nell
 *
 * Copyright (c) 2012 Tane Piper
 * Licensed under the MIT license.
 * https://github.com/tanepiper/nell/blob/master/LICENSE-MIT
 */
'use strict';

var async = require('async');

module.exports = function(nell_site, item, done) {

  var processQueue = async.queue(function(plugin, plugin_done) {
    var plugin_args = plugin.replace('{%', '').replace('%}', '').trim().split(' ');
    var command = plugin_args.splice(0, 1)[0];
    item.content = item.content.replace(plugin, nell_site.plugins[command].apply(this, plugin_args));
    plugin_done();
  }, 10);

  var plugin_tags = item.content.match(/(?:\{\%\s?)(.+)(?:\s?\%\})/gim);
  if (plugin_tags) {
    processQueue.push(plugin_tags, done);
  } else {
    done();
  }
};