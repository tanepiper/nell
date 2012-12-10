/*
 * hyde
 * https://github.com/tanepiper/hyde
 *
 * Copyright (c) 2012 Tane Piper
 * Licensed under the MIT license.
 * https://github.com/tanepiper/hyde/blob/master/LICENSE-MIT
 */
'use strict';

var express = require('express');

module.exports = {
  key: 'preview',
  desc: 'preview site',
  run: function(options, done) {
    var server = express();
    server.use(express.static(options.path));
    server.listen(options.port);
    done();
  }
};