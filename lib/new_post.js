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

module.exports = {
  key: 'new_post',
  args: '[name]',
  desc: __('Create a new post with title as a quote encased string (e.g. "My New Post")'),
  run: function(site_path, arg, cmd, done) {
    var now = new Date();

    var file_name = dateformat(now, 'yyyy-mm-dd') + '-' + (arg.toLowerCase().split(' ').join('-')).replace(/[^a-zA-Z0-9\-_]/g, '-') + '.md';
    var output_path = path.join(site_path, 'source', 'posts', file_name);
    var output_file = fs.createWriteStream(output_path, {flags: 'w', encoding: 'utf8'});
    output_file.on('close', function() {
      done(null, __('Post "%s" created in %s', arg, output_path));
    });
    output_file.on('error', done);

    output_file.write('<!--\n');
    output_file.write('layout: post\n');
    output_file.write(util.format('title: %s\n', arg));
    output_file.write(util.format('date: %s\n', dateformat(now, 'yyyy-mm-dd HH:MM')));
    output_file.write('comments: true\n');
    output_file.write('categories: \n');
    output_file.write('published: false\n');
    output_file.write('-->\n');
    output_file.end('\n', 'utf8');

  }
};

