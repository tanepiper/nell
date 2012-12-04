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
var dateformat = require('dateformat');

var newitem = function(site_path, options, cb) {

  var now = new Date();
  var output =  '<!--\n' +
                'layout: ' + options.layout + '\n' +
                'title: ' + options.name + '\n' +
                'date: ' + dateformat(now, 'yyyy-mm-dd hh:MM') + '\n' +
                'tags: \n' +
                'published: \n' + 
                '-->\n\n';

  fs.writeFile(site_path + '/source/posts/' + dateformat(now, 'yyyy-mm-dd') + '-' + options.name.toLowerCase().split(' ').join('-') + '.md', output, cb);
};

module.exports = newitem;