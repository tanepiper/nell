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

var fs = require('fs');
var path = require('path');
var dateformat = require('dateformat');
var util = require('util');
var mkdirp = require('mkdirp');

module.exports = {
  key: 'new_page',
  args: '[name]',
  desc: __('Create a new page with title as a quote encased string (e.g. "My New Page")'),
  run: function(site_path, arg, cmd, done) {
    var now = new Date();

    // First check to see if this was passed as a directory path
    var dirs = '';
    var file = '';
    if (arg.indexOf('/') !== -1) {
      dirs = arg.split('/');
      file = dirs.pop();
      dirs = dirs.join('/');
    } else {
      file = arg;
    }

    var file_name = (file.toLowerCase().split(' ').join('-')).replace(/[^a-zA-Z0-9\-_]/g, '-') + '.md';
    var output_path = path.join(site_path, 'source', 'pages', dirs);
    mkdirp(output_path, function(err) {
      if (err) {
        return done(err);
      }
      var output_file = fs.createWriteStream( path.join(output_path, file_name), {flags: 'w', encoding: 'utf8'});
      output_file.on('close', function() {
        done(null, __('Page "%s" created in %s', file, output_path));
      });
      output_file.on('error', done);

      output_file.write('<!--\n');
      output_file.write('layout: page\n');
      output_file.write(util.format('title: %s\n', file));
      output_file.write(util.format('date: %s\n', dateformat(now, 'yyyy-mm-dd HH:MM')));
      output_file.write('comments: true\n');
      output_file.write('categories: \n');
      output_file.write('published: false\n');
      output_file.write('-->\n');
      output_file.end('\n', 'utf8');
    });
  }
};

