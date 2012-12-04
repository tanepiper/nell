'use strict';

var jade = require('jade');
var fs = require('fs');
var path = require('path');
var marked = require('marked');
var mde = require('markdown-extra');
var _ = require('underscore');

marked.setOptions({
  gfm: true,
  pedantic: false,
  sanitize: false
});

var generatePosts = function(output, locals, done) {
  var posts_path = path.join(locals.site_path, 'source', 'posts');

  fs.readdir(posts_path, function(err, posts) {
    posts.reverse().forEach(function(post_file) {
      var post_path = path.join(posts_path, post_file);
      var output_path = path.join(locals.site_path, 'output', 'posts', post_file.replace('.md', '.html'));
      var post = fs.readFileSync(post_path, 'utf8');

      var post_object = {
        link: '/posts/' + post_file.replace('.md', '.html')
      };
      
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
      locals.posts.push(post_object);

      var current_post_locals = _.extend(locals, { post: post_object });
      var current_post_output = output(current_post_locals);

      fs.writeFileSync(output_path, current_post_output, 'utf8');
    });

    done();
  });
};

var generate = function(site_path, config, done) {

  var site_locals = _.extend({
    posts: []
  }, config);

  // Set up paths
  site_locals.site_path = site_path;
  site_locals.theme_path = path.join(site_path, 'themes', (config.theme && config.theme.name) ? config.theme.name : 'default');
  site_locals.template_path = path.join(site_locals.theme_path, '/templates');
  site_locals.template_file = path.join(site_locals.template_path, ( (config.theme && config.theme.index) ? config.theme.index : 'default.jade') );

  // Load the template file
  var template_file_content = fs.readFileSync(site_locals.template_file, 'utf8');

  // Generate out jade function to output
  var output = jade.compile(template_file_content, {
    filename: site_locals.template_file,
    pretty: true
  });

  generatePosts(output, site_locals, function() {
    var home_page_items = site_locals.posts.slice(0, site_locals.site.index);
    var home_page_locals = _.extend(site_locals, {
      posts: home_page_items
    });
    var this_output_html = output(home_page_locals);
    fs.writeFileSync(path.join(site_locals.site_path, 'output', 'index.html'), this_output_html, 'utf8');
    done();
  });
};

module.exports = generate;