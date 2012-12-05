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

var createPost = function(site_path, options, done) {
  var now = new Date();
  var output = [];

  output.push('<!--');
  output.push('layout: post');
  output.push('title: ' + options.name);
  output.push('date: ' + dateformat(now, 'yyyy-mm-dd hh:MM'));
  output.push('comments: true');
  output.push('categories: ');
  output.push('published: false');
  output.push('-->');
  output.push('');

  var file_name = dateformat(now, 'yyyy-mm-dd') + '-' + options.name.toLowerCase().split(' ').join('-') + '.md';
  var output_path = path.join(site_path, 'source', 'posts', file_name);
  var output_file = fs.createWriteStream(output_path);

  output_file.on('close', done);
  output_file.on('error', done);

  output_file.end(output.join('\n'), 'utf8');
};

var createPage = function(site_path, options, done) {
  var now = new Date();
  var output = [];

  output.push('<!--');
  output.push('layout: page');
  output.push('title: ' + options.name);
  output.push('date: ' + dateformat(now, 'yyyy-mm-dd hh:MM'));
  output.push('comments: true');
  output.push('categories: ');
  output.push('published: false');
  output.push('-->');
  output.push('');

  var file_name = dateformat(now, 'yyyy-mm-dd') + '-' + options.name.toLowerCase().split(' ').join('-') + '.md';
  var output_path = path.join(site_path, 'source', 'pages', file_name );
  var output_file = fs.createWriteStream(output_path);

  output_file.on('close', done);
  output_file.on('error', done);

  output_file.end(output.join('\n'), 'utf8');
};


var newitem = function(site_path, options, done) {
  if (options.type === 'page') {
    createPage(site_path, options, done);
  } else if (options.type === 'post') {
    createPost(site_path, options, done);
  }
};

module.exports = newitem;