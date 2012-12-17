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

var cliff = require('cliff');
var load_plugins = require('./generate/load_plugins');

module.exports = {
  key: 'plugins',
  args: null,
  desc: __('Lists all available plugins for this site'),
  run: function(site_path, arg, cmd, done) {

    var nell_site = {
      site_path: site_path
    };

    var rows = [
      ['Plugin', 'Arguments', 'Description']
    ];

    load_plugins(nell_site, function(err) {
      if (err) {
        return done(err);
      }

      Object.keys(nell_site.plugins_desc).forEach(function(plugin) {
        plugin = nell_site.plugins_desc[plugin];
        rows.push([plugin.key, plugin.args, plugin.desc]);
      });
      console.log(cliff.stringifyRows(rows, ['red', 'blue', 'green']));

      done(null);
    });
  }
};