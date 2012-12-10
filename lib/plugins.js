'use strict';

var load_plugins = require('./generate/load_plugins');

module.exports = {
  key: 'plugins',
  args: null,
  desc: 'Lists all available plugins for this site',
  run: function(site_path, arg, cmd, done) {

    var hyde_site = {
      site_path: site_path
    };

    load_plugins(hyde_site, function(err) {
      if (err) {
        return done(err);
      }

      Object.keys(hyde_site.plugins_desc).forEach(function(plugin) {
        plugin = hyde_site.plugins_desc[plugin];
        console.log(plugin.key + ' ' + plugin.args + '\t\t' + plugin.desc + '\n');
      });
      done(null);
    });
  }
};