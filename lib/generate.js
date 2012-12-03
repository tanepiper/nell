'use strict';

var jade = require('jade');
var fs = require('fs');
var marked = require('marked');
var mde = require('markdown-extra');
var _ = require('underscore');

var index_total = 5;
var index_locals = { posts: [] };

marked.setOptions({
  gfm: true,
  pedantic: false,
  sanitize: false
});

var generate = function(site_path, options, cb) {
  var theme_path = site_path + '/themes/' + options.theme;
  var template_path = theme_path + '/templates';
  var template_file = template_path + ( (options.template) ? '/' + options.template : '/default.jade');
  var template_file_content = fs.readFileSync(template_file, 'utf8');

  var output = jade.compile(template_file_content, {
    filename: template_file,
    pretty: true
  });

  var global_locals = {
    site: options.site
  };

  var current_index = 0;
  fs.readdir(site_path + '/source/posts', function(err, posts) {
    posts.reverse().forEach(function(post_file) {

      var output_name = post_file.replace('.md', '.html');

      var post = fs.readFileSync(site_path + '/source/posts/' + post_file, 'utf8');
      var post_object = {};

      var meta = mde.metadata(post);
      var content = mde.content(post);

      meta.split('\n').forEach(function(meta_line) {
        var kv = meta_line.split(/^([A-Za-z_]*)(?::)/ig);

        if (['tags', 'js_includes', 'css_includes'].indexOf(kv[1]) !== -1) {
          post_object[ kv[1] ] = kv[2].split(',').map(function(item) { return item.trim(); });
        } else {
          post_object[ kv[1] ] = kv[2].trim();
        }
      });

      post_object.content = marked(content.trim());

      var this_output_locals = _.extend(global_locals, {
        post: post_object
      });

      var this_output_html = output(this_output_locals);
      fs.writeFileSync(site_path + '/output/posts/' + output_name, this_output_html, 'utf8');

      if (current_index < index_total) {
        index_locals.posts.push(this_output_locals);
        current_index++;
      }
    });

    if (options.site.homepage) {

    } else {
      var this_output_locals = _.extend(global_locals, {
        posts: index_locals
      });
      var this_output_html = output(this_output_locals);
      fs.writeFileSync(site_path + '/output/index.html', this_output_html, 'utf8');
    }
    cb(null);
  });
};

module.exports = generate;