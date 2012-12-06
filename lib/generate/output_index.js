'use strict';

var fs = require('fs');
var path = require('path');
var jade = require('jade');
var _ = require('underscore');

module.exports = function(hyde_site, done) {
  var template_file = path.join(hyde_site.site_path, 'themes',
                                (hyde_site.theme && hyde_site.theme.name) ? hyde_site.theme.name : 'default',
                                'templates', 'index.jade');
  var template_file_content = fs.readFileSync(template_file, 'utf8');
  var output_function = jade.compile(template_file_content, {
    filename: template_file,
    pretty: true
  });
  var items = hyde_site.posts.slice(0, 5);
  var index_locals = _.extend(hyde_site, {posts: items});
  var index_html = output_function(index_locals);
  fs.writeFileSync(path.join(hyde_site.site_path, 'output', 'index.html'), index_html, 'utf8');
  done();
};