'use strict';

var fs = require('fs');
var path = require('path');
var jade = require('jade');
var _ = require('underscore');
var mkdirp = require('mkdirp');

module.exports = function(hyde_site, type, done) {
  var template_file = path.join(hyde_site.site_path, 'themes',
                                (hyde_site.theme && hyde_site.theme.name) ? hyde_site.theme.name : 'default',
                                'templates', type + '.jade');
  var template_file_content = fs.readFileSync(template_file, 'utf8');

  var output_function = jade.compile(template_file_content, {
    filename: template_file,
    pretty: true
  });
  hyde_site[type + 's'].forEach(function(item) {
    var item_object = {};
    item_object[type] = item;
    var current_post_locals = _.extend(hyde_site, item_object);
    var current_post_html = output_function(current_post_locals);
    mkdirp.sync(item.file_output.output_path);
    fs.writeFileSync(item.file_output.named_path, current_post_html, 'utf8');
  });
  done();
};