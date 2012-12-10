/*
 * hyde
 * https://github.com/tanepiper/hyde
 *
 * Copyright (c) 2012 Tane Piper
 * Licensed under the MIT license.
 * https://github.com/tanepiper/hyde/blob/master/LICENSE-MIT
 */
'use strict';

var fs = require('fs');
var path = require('path');
var dateformat = require('dateformat');

module.exports = {
  key: 'new_post',
  args: '[name]',
  desc: 'Create a new post with title as a quote encased string (e.g. "My New Post")',
  run: function(site_path, options, done) {
    var now = new Date();

    var file_name = dateformat(now, 'yyyy-mm-dd') + '-' + options.name.toLowerCase().split(' ').join('-') + '.md';
    var output_path = path.join(site_path, 'source', 'posts', file_name);
    var output_file = fs.createWriteStream(output_path, {flags: 'w+', encoding: 'utf8'});
    output_file.on('close', done);
    output_file.on('error', done);

    output_file.write('<!--');
    output_file.write('layout: post');
    output_file.write('title: ' + options.name);
    output_file.write('date: ' + dateformat(now, 'yyyy-mm-dd hh:MM'));
    output_file.write('comments: true');
    output_file.write('categories: ');
    output_file.write('published: false');
    output_file.write('-->');
    output_file.end('\n', 'utf8');

  }
};

