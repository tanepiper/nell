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
var async = require('async');

marked.setOptions({
  gfm: true,
  pedantic: false,
  sanitize: false
});

var generateOutputDetails = function(hyde_site, name, type) {
  var extension;
  var folder;

  if (type === 'post') {
    var year = name.substring(0, 4);
    var month = name.substring(5, 7);
    var day = name.substring(8, 10);

    extension = name.indexOf('.md');
    folder = name.substring(11, extension);

    return {
      output_path: path.join(hyde_site.site_path, 'output', 'posts', year, month, day, folder),
      link_path: path.join('/', 'posts', year, month, day, folder),
      named_path: path.join(hyde_site.site_path, 'output', 'posts', year, month, day, folder, 'index.html')
    };
  } else if (type === 'page') {
    extension = name.indexOf('.md');
    folder = name.substring(0, extension);

    return {
      output_path: path.join(hyde_site.site_path, 'output', folder),
      link_path: path.join('/', folder),
      named_path: path.join(hyde_site.site_path, 'output', folder, 'index.html')
    };
  }
};

/**
 *  This function loads in both global and local plugins
 */
var loadPlugins = function(hyde_site, done) {

  hyde_site.plugins = {};
  async.series([
    function(callback) {
      // First load global plugins
      fs.readdir(path.join(__dirname, 'plugins'), function(err, plugins) {
        if (err) {
          callback(err);
          return;
        }
        if (plugins.length > 0) {
          plugins.forEach(function(plugin) {
            hyde_site.plugins[plugin.replace('.js', '')] = require(path.join(__dirname, 'plugins', plugin));
          });
        }
        callback();
      });
      // Next we load user plugins, we load this after the globals as we allow the user to overide existing plugins
      // with their own
    }, function(callback) {
      fs.readdir(path.join(hyde_site.site_path, 'plugins'), function(err, plugins) {
        if (err) {
          callback(err);
          return;
        }
        if (plugins.length > 0) {
          plugins.forEach(function(plugin) {
            hyde_site.plugins[plugin.replace('.js', '')] = require(path.join(hyde_site.site_path, 'plugins', plugin));
          });
        }
        callback();
      });
    }
  ], done);
};

var loadItems = function(hyde_site, type, done) {
  hyde_site[type + 's_path'] = path.join(hyde_site.site_path, 'source', type + 's');
  async.waterfall([
    function(callback) {
      fs.readdir(hyde_site[type + 's_path'], callback);
    }, function(files, callback) {  
      if (files.length > 0) {
        hyde_site[type + 's'] = [];
        var files_date_order = files.reverse();

        files_date_order.forEach(function(file) {
          var item = {};
          item.file_path = path.join(hyde_site[type + 's_path'], file);
          item.file_output = generateOutputDetails(hyde_site, file, type);
          item.link = item.file_output.link_path;
          item.file_content_raw = fs.readFileSync(item.file_path, 'utf8');
          item.file_metadata = mde.metadata(item.file_content_raw);
          item.file_content = mde.content(item.file_content_raw);
          hyde_site[type + 's'].push(item);
        });
        callback();
      }
    }
  ], done);
};

var processPlugins = function(hyde_site, type, done) {
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

var processItems = function(hyde_site, type, done) {
  hyde_site[type + 's'].forEach(function(item) {

    item.file_metadata.split('\n').forEach(function(meta_line) {
      var meta_key_value = meta_line.split(/^([A-Za-z_]*)(?::\s?)/ig);

      if (['categories', 'js_includes', 'css_includes'].indexOf(meta_key_value[1]) !== -1) {
         if (meta_key_value[2].trim() !== '') {
            item[ meta_key_value[1] ] = meta_key_value[2].trim().split(',').map(function(mitem) { return mitem.trim(); });
          } else {
            item[ meta_key_value[1] ] = false; 
          }
      } else {
        item[ meta_key_value[1] ] = meta_key_value[2].trim();
      }
    });

    item.content = marked(item.file_content);
  });
  done();
};

var outputItems = function(hyde_site, type, done) {
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

var outputIndex = function(hyde_site, done) {
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

/**
 * This function allows us to generate the complete site output.
 * It first needs to read all the source data, this way we have all the available
 * post and page data used to generate our page content, and also make available
 * to other sections like sidebars
 */
var generate = function(site_path, done) {
  var hyde_site = {
    site_path: site_path
  };

  // First check we have a config file in the base of the project folder
  hyde_site.config_path = path.join(site_path, 'hyde.json');
  if ( !fs.existsSync(hyde_site.config_path) ) {
    done( new Error('Unable to load hyde.json config file') );
    return;
  }
  hyde_site.config = require(hyde_site.config_path);
  // From the above config, get some specific members that we want to be more useful
  hyde_site.site = (hyde_site.config.site) ? hyde_site.config.site : {};
  hyde_site.menu = (hyde_site.config.menu) ? hyde_site.config.menu : {};

  // Manage the output path of the site
  hyde_site.output_path =  (hyde_site.config.output && hyde_site.config.output.path) ? path.join(hyde_site.site_path, hyde_site.config.output.path) : path.join(hyde_site.site_path, 'output');

  // Check if the user wants us to delete the output on generation
  if (hyde_site.config.output && hyde_site.config.output.delete) {
    fs.unlinkSync(hyde_site.output_path);
  }
  //console.log(hyde_site);

  // Load plugins
  async.series([
    function(callback) {
      loadPlugins(hyde_site, callback);
    },
    function(callback) {
      loadItems(hyde_site, 'post', function() {
        processItems(hyde_site, 'post', function() {
          processPlugins(hyde_site, 'post', callback);
        });
      });
    },
    function(callback) {
      loadItems(hyde_site, 'page', function() {
        processItems(hyde_site, 'page', function() {
          processPlugins(hyde_site, 'page', callback);
        });
      });
    },
    function(callback) {
      outputItems(hyde_site, 'post', callback);
    },
    function(callback) {
      outputItems(hyde_site, 'page', callback);
    },
    function(callback) {
      outputIndex(hyde_site, callback);
    }
  ], done);
};

module.exports = generate;