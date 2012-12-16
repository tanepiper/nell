'use strict';

var cliff = require('cliff');
var load_plugins = require('./generate/load_plugins');

module.exports = {
  key: 'plugins',
  args: null,
  desc: 'Lists all available plugins for this site',
  run: function(site_path, arg, cmd, done) {

    var hyde_site = {
      site_path: site_path
    };

    var rows = [
      ['Plugin', 'Arguments', 'Description']
    ];

    load_plugins(hyde_site, function(err) {
      if (err) {
        return done(err);
      }

      Object.keys(hyde_site.plugins_desc).forEach(function(plugin) {
        plugin = hyde_site.plugins_desc[plugin];
        rows.push([plugin.key, plugin.args, plugin.desc]);
      });
      console.log(cliff.stringifyRows(rows, ['red', 'blue', 'green']));

      done(null);
    });
  }
};