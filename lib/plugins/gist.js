/*
 * hyde
 * https://github.com/tanepiper/hyde
 *
 * Copyright (c) 2012 Tane Piper
 * Licensed under the MIT license.
 * https://github.com/tanepiper/hyde/blob/master/LICENSE-MIT
 */
'use strict';

var util = require('util');

module.exports = {
  key: 'gist',
  args: '[id, <filename>]',
  desc: 'Takes a gist id and optional filename and returns a gist embed',
  run: function(id, filename) {
    var str = util.format('<script src="https://gist.github.com/%s.js', id);
    if (filename) {
      str += util.format('?file=%s', filename);
    }
    str +='"></script>';
    return str;
  }
};