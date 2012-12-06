'use strict';

module.exports = function(hyde_site, type, done) {
  hyde_site[type + 's'].forEach(function(item) {
    var plugin_tags = item.content.match(/(?:\{\%\s?)(.+)(?:\s?\%\})/gim);
    if (plugin_tags) {
      plugin_tags.forEach(function(plugin_tag) {
        var plugin_args = plugin_tag.replace('{%', '').replace('%}', '').trim().split(' ');
        var command = plugin_args.splice(0, 1)[0];
        item.content = item.content .replace(plugin_tag, hyde_site.plugins[command].apply(this, plugin_args));
      });
    }
  });
  done();
};