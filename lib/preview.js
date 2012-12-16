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
var util = require('util');

module.exports = {
  key: 'preview',
  args: '[port:4000]',
  default: 4000,
  desc: 'preview site',
  run: function(site_path, arg, cmd, done) {
    var port;
    try {
      
      var check_port = isNaN( parseInt(arg, 10) );
      if (check_port) {
        console.log(util.format('Preview error, port %s is not valid, falling back to default %d', arg, 4000));
      }
      port = check_port ? 4000 : arg;
      var server = express();
      server.use(express.static(site_path + '/output'));
      server.listen(port);
    } catch(e) {
      done(e);
      return;
    }
    done(null, util.format('Site preview at http://127.0.0.1:%d', port));
  }
};