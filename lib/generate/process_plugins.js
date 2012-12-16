/*
 * hyde
 * https://github.com/tanepiper/hyde
 *
 * Copyright (c) 2012 Tane Piper
 * Licensed under the MIT license.
 * https://github.com/tanepiper/hyde/blob/master/LICENSE-MIT
 */
'use strict';

var async = require('async');

module.exports = function(hyde_site, item, done) {

  var processQueue = async.queue(function(plugin, plugin_done) {
    var plugin_args = plugin.replace('{%', '').replace('%}', '').trim().split(' ');
    var command = plugin_args.splice(0, 1)[0];
    item.content = item.content.replace(plugin, hyde_site.plugins[command].apply(this, plugin_args));
    plugin_done();
  }, 10);

  var plugin_tags = item.content.match(/(?:\{\%\s?)(.+)(?:\s?\%\})/gim);
  if (plugin_tags) {
    processQueue.push(plugin_tags, done);
  } else {
    done();
  }
};