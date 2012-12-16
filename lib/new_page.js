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
var util = require('util');

module.exports = {
  key: 'new_page',
  args: '[name]',
  desc: 'Create a new page with title as a quote encased string (e.g. "My New Page")',
  run: function(site_path, arg, cmd, done) {
    var now = new Date();

    var file_name = dateformat(now, 'yyyy-mm-dd') + '-' + (arg.toLowerCase().split(' ').join('-')).replace(/[^a-zA-Z0-9\-_]/g, '-') + '.md';
    var output_path = path.join(site_path, 'source', 'pages', file_name );
    var output_file = fs.createWriteStream(output_path, {flags: 'w', encoding: 'utf8'});
    output_file.on('close', function() {
      done(null, util.format('Page "%s" created in %s', arg, output_path));
    });
    output_file.on('error', done);

    output_file.write('<!--\n');
    output_file.write('layout: page\n');
    output_file.write(util.format('title: %s\n', arg));
    output_file.write(util.format('date: %s\n', dateformat(now, 'yyyy-mm-dd HH:MM')));
    output_file.write('comments: true\n');
    output_file.write('categories: \n');
    output_file.write('published: false\n');
    output_file.write('-->\n');
    output_file.end('\n', 'utf8');
  }
};

