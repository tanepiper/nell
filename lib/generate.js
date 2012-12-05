/*
 * hyde
 * https://github.com/tanepiper/hyde
 *
 * Copyright (c) 2012 Tane Piper
 * Licensed under the MIT license.
 * https://github.com/tanepiper/hyde/blob/master/LICENSE-MIT
 */
'use strict';

var jade = require('jade');
var fs = require('fs');
var path = require('path');
var marked = require('marked');
var mde = require('markdown-extra');
var _ = require('underscore');
var mkdirp = require('mkdirp');

marked.setOptions({
  gfm: true,
  pedantic: false,
  sanitize: false
});

var generateOutputDetails = function(name, site_path, type) {

  
  var extension;
  var folder;

  if (type === 'post') {
    var year = name.substring(0, 4);
    var month = name.substring(5, 7);
    var day = name.substring(8, 10);

    extension = name.indexOf('.md');
    folder = name.substring(11, extension);

    return {
      output_path: path.join(site_path, 'output', 'posts', year, month, day, folder),
      link_path: path.join('/', 'posts', year, month, day, folder),
      named_path: path.join(site_path, 'output', 'posts', year, month, day, folder, 'index.html')
    };
  } else if (type === 'page') {
    extension = name.indexOf('.md');
    folder = name.substring(0, extension);

    return {
      output_path: path.join(site_path, 'output', folder),
      link_path: path.join('/', folder),
      named_path: path.join(site_path, 'output', folder, 'index.html')
    };
  }
};

var generatePosts = function(output, locals, done) {
  var posts_path = path.join(locals.site_path, 'source', 'posts');

  fs.readdir(posts_path, function(err, posts) {
    posts.reverse().forEach(function(post_file) {
      var post_path = path.join(posts_path, post_file);
      var output_details = generateOutputDetails(post_file, locals.site_path, 'post');
      
      var post = fs.readFileSync(post_path, 'utf8');

      var post_object = {
        link: output_details.link_path
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
      var current_post_html = output(current_post_locals);

      var plugin_tags = current_post_html.match(/(?:\{\%\s?)(.+)(?:\s?\%\})/gim);
      if (plugin_tags) {
        plugin_tags.forEach(function(plugin) {
          var plugin_line = plugin.replace('{%', '').replace('%}', '').trim();
          var plugin_args = plugin_line.split(' ');
          var command = plugin_args.splice(0, 1)[0];
          current_post_html = current_post_html.replace(plugin, locals.plugins[command].apply(this, plugin_args));
        });
      }

      mkdirp(output_details.output_path, function(err) {
        if (err) {
          done(err);
          return;
        }
        fs.writeFileSync(output_details.named_path, current_post_html, 'utf8');
      });
    });
    delete locals.post;
    done();
  });
};

var generatePages = function(output, locals, done) {
  var pages_path = path.join(locals.site_path, 'source', 'pages');

  fs.readdir(pages_path, function(err, pages) {
    pages.forEach(function(page_file) {
      var page_path = path.join(pages_path, page_file);
      var output_details = generateOutputDetails(page_file, locals.site_path, 'page');
      
      var page = fs.readFileSync(page_path, 'utf8');

      var page_object = {
        link: output_details.link_path
      };

      var meta = mde.metadata(page);
      var content = mde.content(page);

      meta.split('\n').forEach(function(meta_line) {
        var kv = meta_line.split(/^([A-Za-z_]*)(?::)/ig);

        if (['tags', 'js_includes', 'css_includes'].indexOf(kv[1]) !== -1) {
          page_object[ kv[1] ] = kv[2].split(',').map(function(item) { return item.trim(); });
        } else {
          page_object[ kv[1] ] = kv[2].trim();
        }
      });

      page_object.content = marked(content.trim());
      locals.pages.push(page_object);

      var current_page_locals = _.extend(locals, { page: page_object });
      var current_page_html = output(current_page_locals);

      var plugin_tags = current_page_html.match(/(?:\{\%\s?)(.+)(?:\s?\%\})/gim);

      if (plugin_tags) {
        plugin_tags.forEach(function(plugin) {
          var plugin_line = plugin.replace('{%', '').replace('%}', '').trim();
          var plugin_args = plugin_line.split(' ');
          var command = plugin_args.splice(0, 1)[0];
          current_page_html = current_page_html.replace(plugin, locals.plugins[command].apply(this, plugin_args));
        });
      }

      mkdirp(output_details.output_path, function(err) {
        if (err) {
          done(err);
          return;
        }
        fs.writeFileSync(output_details.named_path, current_page_html, 'utf8');
      });
    });
    delete locals.page;
    done();
  });
};

var generate = function(site_path, config, done) {

  mkdirp(path.join(site_path, 'output'), function(err) {
    if (err) {
      done(err);
      return;
    }
    
    var site_locals = _.extend({
      plugins: {},
      posts: [],
      pages: []
    }, config);

    fs.readdirSync(__dirname + '/plugins').forEach(function(plugin) {
      site_locals.plugins[plugin.replace('.js', '')] = require(__dirname + '/plugins/' + plugin);
    });

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
      var home_page_html = output(home_page_locals);

      var plugin_tags = home_page_html.match(/(?:\{\%\s?)(.+)(?:\s?\%\})/gim);
      if (plugin_tags) {
        plugin_tags.forEach(function(plugin) {
          var plugin_line = plugin.replace('{%', '').replace('%}', '').trim();
          var plugin_args = plugin_line.split(' ');
          var command = plugin_args.splice(0, 1)[0];
          home_page_html = home_page_html.replace(plugin, site_locals.plugins[command].apply(this, plugin_args));
        });
      }
      fs.writeFileSync(path.join(site_locals.site_path, 'output', 'index.html'), home_page_html, 'utf8');

      generatePages(output, site_locals, function() {
        done();
      });
    });
  });
};

module.exports = generate;