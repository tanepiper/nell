/*
 * hyde
 * https://github.com/tanepiper/hyde
 *
 * Copyright (c) 2012 Tane Piper
 * Licensed under the MIT license.
 * https://github.com/tanepiper/hyde/blob/master/LICENSE-MIT
 */
'use strict';

module.exports = function(id, filename) {
  return '<script src="https://gist.github.com/' + id + '.js' + ( (filename) ? '?file=' + filename : '') + '"></script>';
};